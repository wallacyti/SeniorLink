$ErrorActionPreference = 'Stop'
$taskRoot = 'C:\Users\wallacy.souza\Documents\SeniorLink'
$taskDocx = Join-Path $taskRoot 'output\doc\SeniorLink-documentacao-tecnica.docx'
$taskPdf = Join-Path $taskRoot 'output\pdf\SeniorLink-documentacao-tecnica.pdf'
$taskWord = $null
$taskDocument = $null
try {
    $taskWord = New-Object -ComObject Word.Application
    $taskWord.Visible = $false
    $taskWord.DisplayAlerts = 0
    $taskWord.AutomationSecurity = 3
    $taskDocument = $taskWord.Documents.Open($taskDocx, $false, $true, $false)
    $taskDocument.Repaginate()
    $taskDocument.ExportAsFixedFormat($taskPdf, 17)
    Write-Output $taskPdf
} finally {
    if ($null -ne $taskDocument) {
        $taskDocument.Close(0)
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($taskDocument)
    }
    if ($null -ne $taskWord) {
        $taskWord.Quit(0)
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($taskWord)
    }
}
