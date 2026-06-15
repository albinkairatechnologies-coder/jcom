import os
import re

theme_gradient = 'radial-gradient(circle at top, #3a3a3a 0%, #1f1f1f 70%)'
theme_accent = '#1da1f2'

files = ['about.html', 'team.html', 'contact.html']

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # YELLOW & ORANGE -> BLUE
        content = re.sub(r'#f9d854', theme_accent, content, flags=re.IGNORECASE)
        content = re.sub(r'#f2ca5c', theme_accent, content, flags=re.IGNORECASE)
        content = re.sub(r'#f1c40f', theme_accent, content, flags=re.IGNORECASE)
        content = re.sub(r'#ff4d1c', theme_accent, content, flags=re.IGNORECASE)
        content = re.sub(r'#e64419', theme_accent, content, flags=re.IGNORECASE)

        # SOLID DARKS -> RADIAL GRADIENT
        content = re.sub(r'background-color:\s*#121212;?', f'background: {theme_gradient};', content)
        content = re.sub(r'background:\s*#121212;?', f'background: {theme_gradient};', content)
        content = re.sub(r'background-color:\s*#0b1014;?', f'background: {theme_gradient};', content)
        content = re.sub(r'background:\s*#0b1014;?', f'background: {theme_gradient};', content)
        content = re.sub(r'background-color:\s*#0d1115;?', f'background: {theme_gradient};', content)
        content = re.sub(r'background:\s*#0d1115;?', f'background: {theme_gradient};', content)
        
        # LIGHT BG -> RADIAL GRADIENT FOR MAIN SECTIONS
        if f == 'team.html' or f == 'contact.html':
            content = re.sub(r'background-color:\s*white;', f'background: {theme_gradient};', content)
            content = re.sub(r'background-color:\s*#fff;', f'background: {theme_gradient};', content)
            content = re.sub(r'background:\s*#faf6f0;', f'background: {theme_gradient};', content)
            
            # Text normalization
            content = re.sub(r'color:\s*#111;?', 'color: #fff;', content)
            content = re.sub(r'color:\s*#222;?', 'color: #fff;', content)
            content = re.sub(r'color:\s*#333;?', 'color: #fff;', content)
            content = re.sub(r'color:\s*#444;?', 'color: #fff;', content)
            
            # Card backgrounds from white to dark gray
            content = re.sub(r'background:\s*#fff;', 'background: #2a2a2a;', content)
            content = re.sub(r'background:\s*#fdfdfd;', 'background: #1f1f1f;', content)
            content = re.sub(r'background:\s*white;', 'background: #2a2a2a;', content)
            
            # Fix specific embedded teals in team.html
            content = re.sub(r'rgba\(0, 75, 85, 0\.85\)', 'rgba(58, 58, 58, 0.85)', content)
            content = re.sub(r'rgba\(0, 95, 105, 0\.75\)', 'rgba(31, 31, 31, 0.75)', content)

            # Fix any specific overrides
            content = re.sub(r'box-shadow: 0 5px 15px rgba\(0,0,0,0\.05\);', 'box-shadow: 0 5px 15px rgba(0,0,0,0.5);', content)

        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)

print("success!")
