Add-Type -AssemblyName System.Drawing
Add-Type -MemberDefinition '[DllImport("user32.dll")]public static extern bool DestroyIcon(System.IntPtr handle);' -Name 'Win32' -Namespace 'Native'

function New-RoundedRectPath {
    param(
        [System.Drawing.RectangleF]$Rect,
        [float]$Radius
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $Radius * 2
    $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
    $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
    $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

$size = 512
$bitmap = New-Object System.Drawing.Bitmap($size, $size)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$graphics.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

$outerRect = [System.Drawing.RectangleF]::new(16, 16, $size - 32, $size - 32)
$outerPath = New-RoundedRectPath -Rect $outerRect -Radius 72
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0x25,0x63,0xEB))
$graphics.FillPath($bgBrush, $outerPath)

$shieldPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$shieldPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(256, 64),
    [System.Drawing.PointF]::new(380, 120),
    [System.Drawing.PointF]::new(368, 248),
    [System.Drawing.PointF]::new(256, 392),
    [System.Drawing.PointF]::new(144, 248),
    [System.Drawing.PointF]::new(132, 120)
)
$shieldPath.AddClosedCurve($shieldPoints, 0.45)
$shieldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.FillPath($shieldBrush, $shieldPath)

$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0x25,0x63,0xEB), 34)
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$checkPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(192, 240),
    [System.Drawing.PointF]::new(238, 286),
    [System.Drawing.PointF]::new(330, 188)
)
$graphics.DrawLines($pen, $checkPoints)

$pngPath = Join-Path $PSScriptRoot "..\public\icon.png"
$faviconPngPath = Join-Path $PSScriptRoot "..\public\favicon.png"
$icoPath = Join-Path $PSScriptRoot "..\public\favicon.ico"

$bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Save($faviconPngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$hIcon = $bitmap.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
[Native.Win32]::DestroyIcon($hIcon) | Out-Null

$pen.Dispose()
$shieldBrush.Dispose()
$bgBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
