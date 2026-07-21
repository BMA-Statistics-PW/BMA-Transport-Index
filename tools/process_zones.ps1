$files = @(
    @{Path="D:\GitHub_repo\BMA_urban_transport_index\data\travel-speed\zone_urban_trend_2560-2568.csv"; Zone="Urban"},
    @{Path="D:\GitHub_repo\BMA_urban_transport_index\data\travel-speed\zone_suburban_trend_2560-2568.csv"; Zone="Suburban"},
    @{Path="D:\GitHub_repo\BMA_urban_transport_index\data\travel-speed\zone_rural_trend_2560-2568.csv"; Zone="Rural"}
)

$results = New-Object System.Collections.Generic.List[PSObject]

foreach ($fileInfo in $files) {
    # Read the file and handle multi-line rows if any (though usually -Raw and split works better for messy CSVs)
    # But Get-Content should work if it is standard line-based CSV
    $lines = Get-Content $fileInfo.Path
    
    # Headers are rows 1-3. Data starts at row 4 (index 3)
    # Extract row 4 (index 3)
    $firstRoadRow = $lines[3]
    
    # Simple split by comma, but need to handle quotes. 
    # Use Import-Csv trick by skipping headers to get row 4
    $csvData = Get-Content $fileInfo.Path | Select-Object -Skip 3 | ConvertFrom-Csv -Header "ID","Road","Section","2560_In","2560_Out","2561_In","2561_Out","2562_In","2562_Out","2563_In","2563_Out","2564_In","2564_Out","2565_In","2565_Out","2566_In","2566_Out","2567_In","2567_Out","2568_In","2568_Out","Extra"
    
    $row = $csvData[0]
    
    for ($year = 2560; $year -le 2568; $year++) {
        $inCol = "$($year)_In"
        $outCol = "$($year)_Out"
        
        $obj = [PSCustomObject]@{
            Zone     = $fileInfo.Zone
            Year     = $year
            Inbound  = $row.$inCol
            Outbound = $row.$outCol
        }
        $results.Add($obj)
    }
}

$results | Export-Csv -Path "zone_trends_extracted.csv" -NoTypeInformation
$results | Format-Table
