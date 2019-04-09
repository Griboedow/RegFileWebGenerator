Name: 
reg file generator

Author: 
Nikolai Kochkin (urfiner@gmail.com)

Description: 
That JS script generates *.reg file from it's description.
I use it to generate reg keys from descriptions saved in a text format. 

Usage:
createRegFile(
    'MinEncryptionLevel', 
    'dword', 
    'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp',
    '1',
    'The encryption level of the connection. 1 means Low.'
    );



