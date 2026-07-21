$files = @(
    @{Path="D:\GitHub_repo\BMA_urban_transport_index\data\travel-speed\zone_urban_trend_2560-2568.csv"; Zone="Urban"},
    @{Path="D:\GitHub_repo\BMA_urban_transport_index\data\travel-speed\zone_suburban_trend_2560-2568.csv"; Zone="Suburban"},
    @{Path="D:\GitHub_repo\BMA_urban_transport_index\data\travel-speed\zone_rural_trend_2560-2568.csv"; Zone="Rural"}
)

$results = New-Object System.Collections.Generic.List[PSObject]

foreach ($fileInfo in $files) {
    # Import-Csv handles quoted multiline fields correctly
    $data = Import-Csv -Path $fileInfo.Path
    
    # Based on the earlier test, Import-Csv might use the first line as headers
    # Row 1-3 are headers, so data starts at row 4 (index 3 if considering headers as data)
    # If Import-Csv uses the first line as header, then row 4 in the file is row 2 in the object array
    
    # Let's use a more robust skip logic with Get-Content then pipe to ConvertFrom-Csv
    # Row 1: "ลำดับที่","ชื่อถนน",...
    # Row 2: "","","","ปี 2560",...
    # Row 3: "","","","ขาเข้า","ขาออก",...
    # Row 4: "1","จรัญสนิทวงศ์",...
    
    $fullText = Get-Content $fileInfo.Path -Raw
    $csvData = $fullText | ConvertFrom-Csv -Header "ID","Road","Section","2560_In","2560_Out","2561_In","2561_Out","2562_In","2562_Out","2563_In","2563_Out","2564_In","2564_Out","2565_In","2565_Out","2566_In","2566_Out","2567_In","2567_Out","2568_In","2568_Out","Extra"
    
    # The first few rows in csvData will be the actual headers (row 1, 2, 3)
    # We want the first road which is Row 4 in the file
    $firstRoad = $null
    foreach ($row in $csvData) {
        if ($row.ID -eq "1") {
            $firstRoad = $row
            break
        }
    }
    
    if ($firstRoad) {
        for ($year = 2560; $year -le 2568; $year++) {
            $inCol = "$($year)_In"
            $outCol = "$($year)_Out"
            
            # Clean values (remove newlines if any)
            $inVal = $firstRoad.$inCol -replace "\s+", ""
            $outVal = $firstRoad.$outCol -replace "\s+", ""
            
            $obj = [PSCustomObject]@{
                Zone     = $fileInfo.Zone
                Year     = $year
                Inbound  = $inVal
                Outbound = $outVal
            }
            $results.Add($obj)
        }
    }
}

$results | Export-Csv -Path "zone_trends_final.csv" -NoTypeInformation
$results | Format-Table
