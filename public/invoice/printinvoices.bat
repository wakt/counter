rem for %%i in (1,2) do start /WAIT cmd /c d:\apps\counter\public\invoice\printinvoice.bat %1
for %%i in (1,2) do start cmd /c d:\apps\counter\public\invoice\printinvoice.bat %1
start cmd /c d:\apps\counter\public\invoice\monitor.bat
