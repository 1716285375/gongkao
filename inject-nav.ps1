# 给所有笔记HTML注入顶部导航栏
$notesDir = "F:\MyProject\JavaScript\Gongkao\public\notes"
$files = Get-ChildItem "$notesDir\*.html"

$navSnippet = @'
<!-- 知识库导航栏 -->
<div id="kb-nav" style="position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;align-items:center;gap:8px;padding:6px 16px;background:#1e293b;color:#e2e8f0;font-size:13px;font-family:system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.15);">
  <a href="/" style="color:#818cf8;text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:500;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
    知识库首页
  </a>
  <span style="color:#475569;">/</span>
  <span id="kb-nav-title" style="color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
  <div style="margin-left:auto;display:flex;gap:8px;">
    <button onclick="history.back()" style="background:#334155;color:#e2e8f0;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:12px;">← 返回上一页</button>
  </div>
</div>
<script>
// 从文件名提取标题
(function(){
  var name = decodeURIComponent(location.pathname.split('/').pop().replace('.html',''));
  document.getElementById('kb-nav-title').textContent = name;
  // 给body加padding避免遮挡内容
  document.body.style.paddingTop = '36px';
})();
</script>
'@

$count = 0
foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw -Encoding utf8
  # 跳过已经注入过的
  if ($content -match 'id="kb-nav"') { continue }
  # 在 </body> 前注入
  $content = $content -replace '</body>', "$navSnippet`n</body>"
  # 统一UTF8无BOM写入
  [System.IO.File]::WriteAllText($f.FullName, $content, (New-Object System.Text.UTF8Encoding $false))
  $count++
}
Write-Output "已注入 $count 个文件"
