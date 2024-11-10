# Function to listen for incoming connections
function ListenForConnections {
    param (
        [string]$IPAddress = "127.0.0.1",
        [int]$Port = 8080
    )

    # Create a socket object
    $listener = New-Object System.Net.Sockets.TcpListener($IPAddress, $Port)

    Write-Host "Server listening on $IPAddress :$Port..."
    $listener.Start()
    while ($true) {
        try {
            # Start waiting for a connection
            $clientSocket = $listener.AcceptTcpClient()

            # Get the client IP address and port
            $remoteIP = $clientSocket.Client.RemoteEndPoint.Address
            $remotePort = $clientSocket.Client.RemoteEndPoint.Port

            Write-Host "New connection from $remoteIP :$remotePort"

            # Read data from the client
            $stream = $clientSocket.GetStream()
            $buffer = New-Object byte[] 1024
            $bytesRead = $null

            $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
            $message = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
            Write-Host "Received: $message"

            # Send response back to the client
            if ($message -eq "batteryPercentage") {
                Write-Host "Getting battery percentage"
                $response = iex((Get-WmiObject win32_battery).estimatedChargeRemaining)
            } elseif ($message -eq "batteryCount") {
                Write-Host "Getting battery count"
                $response = iex((Get-WmiObject win32_battery).Count)
            } elseif ($message -eq "cpuTemperature") {
                Write-Host "Getting CPU temperature"
                $response = iex((Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi").CurrentTemperature[0])
            } elseif ($message -eq "cpuLoad") {
                Write-Host "Getting CPU Load"
                $response = iex((Get-WmiObject Win32_Processor).LoadPercentage)
            } elseif ("ramUsage") {
                $totalRam = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB # return is in bytes
                $freeRam = (Get-CIMInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB # return is in KB
                $response = (($totalRam - $freeRam) / $totalRam * 100).ToString()
            }
            else {
                $response = "error"
            }
            Write-Host "Operation Result $response"

            $byteArray = [System.Text.Encoding]::ASCII.GetBytes($response)
            $stream.Write($byteArray, 0, $byteArray.Length)
            $stream.Flush()

            Write-Host "Response sent to $remoteIP :$remotePort"

            # Close the client socket
            $clientSocket.Close()
        }
        catch {
            Write-Host "Exception: $_"
        }
    }

    # Close the listener when done
    finally {
        $listener.Stop()
    }
}

# Call the function to start listening
ListenForConnections
