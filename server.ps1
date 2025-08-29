$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:9000/')
$listener.Start()
Write-Host 'Server started at http://localhost:9000/'

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq '/') { 
        $localPath = '/index.html' 
    }
    
    $filePath = Join-Path $PSScriptRoot $localPath.TrimStart('/')
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        
        # Set content type based on file extension
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        switch ($ext) {
            '.css' { $response.ContentType = 'text/css' }
            '.js' { $response.ContentType = 'application/javascript' }
            '.png' { $response.ContentType = 'image/png' }
            '.jpg' { $response.ContentType = 'image/jpeg' }
            '.jpeg' { $response.ContentType = 'image/jpeg' }
            '.gif' { $response.ContentType = 'image/gif' }
            default { $response.ContentType = 'text/html' }
        }
        
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $errorContent = [System.Text.Encoding]::UTF8.GetBytes("File not found: $localPath")
        $response.ContentLength64 = $errorContent.Length
        $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
    }
    
    $response.Close()
}
