$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $bulletFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)

    $graphics.DrawString("Defender Exposure Ops Center", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("•", $bulletFont, $altAccentBrush, 108, $y)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Overview proof" `
    -Subtitle "Attack-path exposure, privileged identities, device risk, and remediation posture in one Microsoft Defender operator surface." `
    -Bullets @(
        "High-severity Defender recommendations surface before audits, change windows, or tenant trust drift.",
        "Degraded controls and missing plans stay visible instead of buried in admin consoles.",
        "Remediation packets make exposure, endpoint, identity, and collaboration ownership explicit."
    )

New-ProofImage -Path (Join-Path $screenshots "02-exposure-lane-proof.png") `
    -Title "Exposure lane" `
    -Subtitle "Every lane keeps owner, risk focus, status, and next action visible." `
    -Bullets @(
        "Attack path, privileged identity, device resilience, and collaboration lanes stay separated cleanly.",
        "Coverage drift remains obvious.",
        "Remediation paths are ready for operator review."
    )

New-ProofImage -Path (Join-Path $screenshots "03-control-gaps-proof.png") `
    -Title "Control gaps" `
    -Subtitle "Gaps map severity, owner, principal, scope, and the exact Defender posture that fired." `
    -Bullets @(
        "Attack-path and privileged-identity signals surface first.",
        "Owner mapping keeps identity, endpoint, and collaboration accountability explicit.",
        "The lane is grounded in Defender exposure evidence."
    )

New-ProofImage -Path (Join-Path $screenshots "04-remediation-posture-proof.png") `
    -Title "Remediation posture" `
    -Subtitle "Packets tie completeness, blocker, owner, and response timing together." `
    -Bullets @(
        "Attack-path breaks, break-glass review, server remediation, and collaboration control packets stay readable.",
        "Red/yellow/green remediation posture is easy to scan.",
        "The system is shaped for real Microsoft Defender exposure proof."
    )
