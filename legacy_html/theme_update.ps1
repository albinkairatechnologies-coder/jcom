$theme_gradient = 'radial-gradient(circle at top, #3a3a3a 0%, #1f1f1f 70%)'
$theme_accent = '#1da1f2'

$files = @("about.html", "team.html", "contact.html")

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content -Path $f -Raw
        
        $content = $content -replace '(?i)#f9d854', $theme_accent
        $content = $content -replace '(?i)#f2ca5c', $theme_accent
        $content = $content -replace '(?i)#f1c40f', $theme_accent
        $content = $content -replace '(?i)#ff4d1c', $theme_accent
        $content = $content -replace '(?i)#e64419', $theme_accent
        
        $content = $content -replace '(?i)background-color:\s*#121212;?', "background: $theme_gradient;"
        $content = $content -replace '(?i)background:\s*#121212;?', "background: $theme_gradient;"
        $content = $content -replace '(?i)background-color:\s*#0b1014;?', "background: $theme_gradient;"
        $content = $content -replace '(?i)background:\s*#0b1014;?', "background: $theme_gradient;"
        $content = $content -replace '(?i)background-color:\s*#0d1115;?', "background: $theme_gradient;"
        $content = $content -replace '(?i)background:\s*#0d1115;?', "background: $theme_gradient;"
        
        if ($f -eq "team.html" -or $f -eq "contact.html") {
            $content = $content -replace '(?i)background-color:\s*white;', "background: $theme_gradient;"
            $content = $content -replace '(?i)background-color:\s*#fff;', "background: $theme_gradient;"
            $content = $content -replace '(?i)background:\s*#faf6f0;', "background: $theme_gradient;"
            
            $content = $content -replace '(?i)color:\s*#111;?', "color: #fff;"
            $content = $content -replace '(?i)color:\s*#222;?', "color: #fff;"
            $content = $content -replace '(?i)color:\s*#333;?', "color: #fff;"
            $content = $content -replace '(?i)color:\s*#444;?', "color: #fff;"
            
            $content = $content -replace '(?i)background:\s*#fff;', "background: #2a2a2a;"
            $content = $content -replace '(?i)background:\s*#fdfdfd;', "background: #1f1f1f;"
            $content = $content -replace '(?i)background:\s*white;', "background: #2a2a2a;"
            
            $content = $content -replace 'rgba\(0, 75, 85, 0\.85\)', "rgba(58, 58, 58, 0.85)"
            $content = $content -replace 'rgba\(0, 95, 105, 0\.75\)', "rgba(31, 31, 31, 0.75)"
            
            $content = $content -replace 'box-shadow: 0 5px 15px rgba\(0,0,0,0\.05\);', "box-shadow: 0 5px 15px rgba(0,0,0,0.5);"
        }
        
        [System.IO.File]::WriteAllText("c:\Users\Admin\Downloads\JCOM\$f", $content, [System.Text.Encoding]::UTF8)
    }
}
Write-Output "theme update successful!"
