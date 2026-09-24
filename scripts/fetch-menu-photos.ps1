$ErrorActionPreference = 'Stop'
$queries = [ordered]@{
  'idli'='Idli'; 'dosa'='Masala dosa'; 'set-dosa'='Set dosa'; 'pesarattu'='Pesarattu'; 'uttapam'='Uttapam';
  'poori'='Puri food'; 'chapati'='Chapati'; 'upma'='Upma'; 'pongal'='Ven pongal'; 'bonda'='Bonda'; 'chole-bhature'='Chole bhature';
  'vada'='Medu vada'; 'masala-vada'='Masala vada'; 'curd-vada'='Dahi vada'; 'meal'='South Indian thali';
  'veg-biryani'='Vegetable biryani'; 'chicken-biryani'='Chicken biryani'; 'mutton-biryani'='Mutton biryani'; 'prawn-biryani'='Prawn biryani'; 'egg-biryani'='Egg biryani';
  'jeera-rice'='Jeera rice'; 'pulao'='Peas pulao'; 'fried-rice'='Vegetable fried rice'; 'pulihora'='Pulihora';
  'brinjal'='Gutti vankaya'; 'aloo-gobi'='Aloo gobi'; 'chole'='Chana masala'; 'paneer'='Paneer butter masala';
  'chicken-curry'='Chicken curry Indian'; 'mutton-curry'='Mutton curry'; 'prawn-curry'='Prawn curry'; 'egg-curry'='Egg curry'; 'chicken-fry'='Chicken fry'; 'liver'='Liver fry'; 'keema'='Keema';
  'fish-curry'='Fish curry'; 'fish-fry'='Fish fry Indian'; 'chilli-chicken'='Chilli chicken'; 'tandoori'='Tandoori chicken'; 'boiled-chicken'='Poached chicken';
  'paratha'='Paratha'; 'pakoda'='Onion pakoda'; 'bajji'='Mirchi bajji'; 'punugulu'='Punugulu'; 'noodles'='Maggi noodles'; 'pasta'='Pasta tomato';
  'lime'='Lime juice'; 'buttermilk'='Chaas'; 'badam-milk'='Badam milk'; 'payasam'='Payasam'; 'sweet-pongal'='Sakkarai pongal';
  'halwa'='Bread halwa'; 'carrot-halwa'='Gajar halwa'; 'gulab-jamun'='Gulab jamun'; 'custard'='Custard dessert'; 'obbattu'='Obbattu'; 'laddu'='Laddu'; 'burfi'='Coconut barfi'; 'boorelu'='Poornalu'; 'salad'='Sprout salad'
}
$folder = Join-Path $PSScriptRoot '../public/assets/dishes'
New-Item -ItemType Directory -Force -Path $folder | Out-Null
$manifestPath = Join-Path $PSScriptRoot '../src/data/photo-credits.json'
$credits = @{}
if (Test-Path $manifestPath) { $credits = Get-Content $manifestPath -Raw | ConvertFrom-Json -AsHashtable }
foreach ($key in $queries.Keys) {
  if ($credits.ContainsKey($key) -and (Test-Path (Join-Path $folder "$key.jpg"))) { continue }
  try {
    Start-Sleep -Seconds 7
    $q = [Uri]::EscapeDataString($queries[$key] + ' filetype:bitmap')
    $url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$q&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=640&format=json"
    $r = Invoke-RestMethod -Uri $url
    $pages = $r.query.pages.PSObject.Properties.Value | Sort-Object index
    $chosen = $pages | Where-Object { $_.imageinfo[0].extmetadata.LicenseShortName.value -match '^(CC BY|CC0|Public domain)' -and $_.imageinfo[0].thumburl -match '\.(jpg|jpeg|png)(\?|$)' } | Select-Object -First 1
    if (!$chosen) { Write-Output "NO PHOTO: $key"; continue }
    $info = $chosen.imageinfo[0]
    $imageUrl = $info.thumburl -replace '\?.*$', ''
    Invoke-WebRequest -Uri $imageUrl -OutFile (Join-Path $folder "$key.jpg")
    $clean = { param($s) [System.Net.WebUtility]::HtmlDecode(($s -replace '<[^>]+>', ' ')).Trim() }
    if (Test-Path $manifestPath) { $credits = Get-Content $manifestPath -Raw | ConvertFrom-Json -AsHashtable }
    $credits[$key] = [ordered]@{ path="/assets/dishes/$key.jpg"; title=$chosen.title; source=$info.descriptionurl; author=(& $clean $info.extmetadata.Artist.value); license=$info.extmetadata.LicenseShortName.value; licenseUrl=$info.extmetadata.LicenseUrl.value; representativeOf=$queries[$key] }
    $credits | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 $manifestPath
    Write-Output "Saved: $key ($($credits[$key].license))"
  } catch { Write-Output "RETRY NEEDED: $key - $($_.Exception.Message)" }
}
