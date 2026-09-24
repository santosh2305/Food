param([string]$Key, [string]$Title)
$ErrorActionPreference = 'Stop'
$url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + [Uri]::EscapeDataString($Title) + '&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=640&format=json'
$r = Invoke-RestMethod $url
$page = $r.query.pages.PSObject.Properties.Value | Select-Object -First 1
$info = $page.imageinfo[0]
if ($info.extmetadata.LicenseShortName.value -notmatch '^(CC BY|CC0|Public domain)') { throw 'Unsupported licence' }
Invoke-WebRequest ($info.thumburl -replace '\?.*$', '') -OutFile "public/assets/dishes/$Key.jpg"
$path = 'src/data/photo-credits.json'
$credits = Get-Content $path -Raw | ConvertFrom-Json -AsHashtable
$credits[$Key] = [ordered]@{ path="/assets/dishes/$Key.jpg"; title=$Title; source=$info.descriptionurl; author=[System.Net.WebUtility]::HtmlDecode(($info.extmetadata.Artist.value -replace '<[^>]+>', ' ')).Trim(); license=$info.extmetadata.LicenseShortName.value; licenseUrl=$info.extmetadata.LicenseUrl.value; representativeOf=($Key -replace '-', ' ') }
$credits | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 $path
Write-Output "Selected: $Key"
