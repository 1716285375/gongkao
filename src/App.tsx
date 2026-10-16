import { useState, useMemo, useEffect } from 'react'
import {
  BookOpen, Cpu, FileText, Newspaper, Search, ChevronRight,
  LayoutGrid, Scale, Home, X, ArrowLeft,
} from 'lucide-react'

interface Note {
  file: string
  title: string
  category: string
  sub?: string
}

interface CatDef {
  id: string
  name: string
  icon: typeof Scale
  accent: string
}

const categories: CatDef[] = [
  { id: 'overview', name: '体系总览', icon: LayoutGrid, accent: '#1d5fbf' },
  { id: 'law', name: '法律思维导图', icon: Scale, accent: '#1d5fbf' },
  { id: 'cs-exam', name: '计算机笔试', icon: Cpu, accent: '#1d5fbf' },
  { id: 'cs-exam-points', name: '真题考点', icon: FileText, accent: '#1d5fbf' },
  { id: 'news', name: '新闻联播月报', icon: Newspaper, accent: '#1d5fbf' },
]

const lawSubcats = [
  { id: 'law-constitution', name: '宪法相关法' },
  { id: 'law-civil', name: '民法商法' },
  { id: 'law-admin', name: '行政法' },
  { id: 'law-econ', name: '经济法' },
  { id: 'law-social', name: '社会法' },
  { id: 'law-enviro', name: '环境资源法' },
  { id: 'law-criminal', name: '刑法' },
  { id: 'law-procedure', name: '诉讼程序法' },
]

const csSubcats = [
  { id: 'cs-overview', name: '总览与速记' },
  { id: 'cs-p01-p05', name: '专项详解 P01-P07' },
  { id: 'cs-courseware', name: '课件基础 01-13' },
]

const lawKeywords: [string[], string][] = [
  [['宪法', '立法法', '监察法', '监察官法', '法官法', '检察官法', '国家赔偿', '国家勋章', '国旗', '国徽', '国歌', '国籍', '领事', '缔结条约', '领海', '专属经济', '戒严', '国防法', '国防动员', '国防交通', '国防教育', '军事设施', '驻军法', '反分裂', '反间谍', '反恐怖', '国家安全法', '国家情报', '反外国制裁', '陆地国界', '对外关系', '外国国家豁免', '外国中央银行', '爱国主义', '法治宣传', '民族区域', '民族团结', '国家发展规划', '各级人大常委', '代表法', '选举法', '地方组织', '国务院组织', '全国人大组织', '议事规则', '居民委员', '村民委员', '香港特别', '澳门特别', '反有组织', '反电信网络', '英雄烈士', '人民陪审', '海警法', '境外非政府'], 'law-constitution'],
  [['民法典', '公司法', '商业银行法', '票据法', '保险法', '拍卖法', '合伙企业法', '证券法', '个人独资', '招标投标', '信托法', '农村土地承包法', '证券投资基金', '电子签名', '企业破产', '农民专业合作', '涉外民事', '期货和衍生品', '农村集体经济', '消费者权益', '海商法', '著作权法', '商标法', '专利法'], 'law-civil'],
  [['行政复议', '行政诉讼', '行政处罚', '行政许可', '行政强制', '公务员法', '治安管理', '居民身份证', '道路交通安全', '公证法', '律师法', '护照法', '突发事件应对', '禁毒法', '食品安全', '药品管理', '疫苗管理', '医师法', '传染病防治', '国境卫生检疫', '海关法', '档案法', '保守国家秘密', '枪支管理', '消防法', '防震减灾', '献血法', '气象法', '人口与计划生育', '民办教育', '精神卫生', '公共文化', '公共图书馆', '密码法', '基本医疗', '反食品浪费', '军人地位', '预备役', '学位法', '学前教育', '突发公共卫生', '教师法', '教育法', '义务教育', '高等教育', '职业教育', '体育法', '科学技术进步', '促进科技成果', '文物保护', '海上交通安全', '兵役法', '现役军官', '军官军衔', '人民警察', '人民武装警察', '驻外外交', '非物质文化', '出境入境', '电影产业', '中医药法', '核安全法', '户口登记', '广东经济特区', '老弱病残', '老干部', '工人退休', '职工探亲', '直接选举', '法律援助', '社区矫正', '监狱法', '人民法院组织', '人民检察院组织', '城市居民委员会'], 'law-admin'],
  [['个人所得税', '统计法', '会计法', '计量法', '邮政法', '标准化法', '进出口商品检验', '铁路法', '烟草专卖', '进出境动植物', '税收征收', '测绘法', '产品质量', '农业技术推广', '农业机械化', '反不正当竞争', '注册会计师', '台湾同胞投资', '预算法', '对外贸易', '城市房地产管理', '审计法', '广告法', '中国人民银行', '民用航空', '电力法', '公路法', '动物防疫', '防洪法', '建筑法', '价格法', '种子法', '政府采购', '中小企业促进', '港口法', '银行业监督管理', '畜牧法', '农产品质量', '反洗钱', '企业所得税', '反垄断', '城乡规划', '企业国有资产', '石油天然气管道', '车船税', '旅游法', '航道法', '资产评估', '网络安全法', '环境保护税', '烟叶税', '船舶吨税', '电子商务', '耕地占用', '车辆购置', '外商投资', '资源税', '城市维护建设', '契税法', '出口管制', '乡村振兴', '数据安全', '海南自由贸易港', '印花税法', '个人信息保护', '粮食安全保障', '关税法', '增值税法', '民营经济促进', '海关关衔'], 'law-econ'],
  [['归侨侨眷', '残疾人保障', '未成年人保护', '工会法', '妇女权益', '矿山安全', '红十字会', '母婴保健', '老年人权益', '预防未成年人', '公益事业捐赠', '职业病防治', '安全生产', '科学技术普及', '就业促进', '社会保险', '军人保险', '特种设备安全', '反家庭暴力', '慈善法', '退役军人保障', '家庭教育促进', '无障碍环境', '危险化学品', '社会救助', '医疗保障'], 'law-social'],
  [['生态环境法典', '森林法', '草原法', '渔业法', '矿产资源', '土地管理', '水法', '野生动物保护', '水土保持', '煤炭法', '节约能源', '防沙治沙', '海域使用', '可再生能源', '循环经济', '海岛保护', '深海海底', '生物安全', '长江保护', '湿地保护', '黑土地保护', '黄河保护', '青藏高原', '能源法', '原子能法', '国家公园', '耕地保护', '环境保护法'], 'law-enviro'],
  [['刑法'], 'law-criminal'],
  [['刑事诉讼', '民事诉讼', '仲裁法', '海事诉讼', '引渡法', '劳动争议', '人民调解', '国际刑事司法'], 'law-procedure'],
]

function getLawSubcat(title: string): string | undefined {
  for (const [keywords, subId] of lawKeywords) {
    if (keywords.some(k => title.includes(k))) return subId
  }
  return undefined
}

function categorize(file: string): { category: string; title: string; sub?: string } {
  const title = file.replace('.html', '').replace(/思维导图$/, '')
  if (file === '国考法律知识体系总览.html') return { category: 'overview', title }
  if (file === '金融监管计算机类笔试考点.html') return { category: 'cs-exam', title, sub: 'cs-overview' }
  if (file === '2027白皮书考点速记.html') return { category: 'cs-exam', title, sub: 'cs-overview' }
  if (file === '经济金融保险英语考点.html') return { category: 'cs-exam', title, sub: 'cs-overview' }
  if (file === '真题考点分析2018-2025.html') return { category: 'cs-exam-points', title }
  if (file.startsWith('P0')) return { category: 'cs-exam', title, sub: 'cs-p01-p05' }
  if (file.startsWith('课件')) return { category: 'cs-exam', title, sub: 'cs-courseware' }
  if (file.startsWith('真题考点_')) return { category: 'cs-exam-points', title: file.replace('真题考点_', '').replace('.html', '') }
  if (file.startsWith('新闻联播月报_')) return { category: 'news', title: file.replace('新闻联播月报_', '').replace('.html', '') }
  if (file.endsWith('思维导图.html')) return { category: 'law', title, sub: getLawSubcat(title) }
  return { category: 'overview', title }
}

const catSubcats: Record<string, { id: string; name: string }[]> = {
  'law': lawSubcats,
  'cs-exam': csSubcats,
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [activeSub, setActiveSub] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/notes/manifest.json')
      .then(r => r.json())
      .then((files: string[]) => {
        setNotes(files.map(f => {
          const { category, title, sub } = categorize(f)
          return { file: f, title, category, sub }
        }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: notes.length }
    notes.forEach(n => {
      c[n.category] = (c[n.category] || 0) + 1
      if (n.sub) c[n.sub] = (c[n.sub] || 0) + 1
    })
    return c
  }, [notes])

  const filtered = useMemo(() => {
    let list = notes
    if (search) {
      list = list.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    } else {
      if (activeCat !== 'all') list = list.filter(n => n.category === activeCat)
      if (activeSub) list = list.filter(n => n.sub === activeSub)
    }
    return list.sort((a, b) => a.title.localeCompare(b.title, 'zh'))
  }, [notes, activeCat, activeSub, search])

  const currentCat = categories.find(c => c.id === activeCat)
  const currentSubList = currentCat ? catSubcats[currentCat.id] : undefined
  const currentSub = currentSubList?.find(s => s.id === activeSub)

  function goCat(catId: string) { setActiveCat(catId); setActiveSub(null) }
  function goSub(subId: string) { setActiveSub(subId) }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f6f6f3' }}>
        <div className="text-sm" style={{ color: '#8b929e' }}>加载笔记目录...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f6f6f3' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: '#fff', borderRight: '1.5px solid #d6dae1' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1.5px solid #d6dae1' }}>
          <h1 className="font-bold flex items-center gap-2" style={{ fontSize: '16px', color: '#16181d' }}>
            <BookOpen style={{ width: 18, height: 18, color: '#1d5fbf' }} />
            国考备考知识库
          </h1>
        </div>
        <nav className="flex-1 py-2">
          <button onClick={() => goCat('all')}
            className="w-full text-left px-5 py-2 flex items-center gap-2 text-sm transition"
            style={{
              color: activeCat === 'all' && !activeSub ? '#1d5fbf' : '#4b5260',
              background: activeCat === 'all' && !activeSub ? '#e4ecf8' : 'transparent',
              borderRight: activeCat === 'all' && !activeSub ? '2.5px solid #1d5fbf' : '2.5px solid transparent',
            }}>
            <LayoutGrid style={{ width: 15, height: 15 }} />
            全部笔记
            <span className="ml-auto text-xs" style={{ color: '#8b929e' }}>{counts.all || 0}</span>
          </button>

          {categories.map(cat => (
            <div key={cat.id}>
              <button onClick={() => goCat(cat.id)}
                className="w-full text-left px-5 py-2 flex items-center gap-2 text-sm transition"
                style={{
                  color: activeCat === cat.id && !activeSub ? '#1d5fbf' : '#4b5260',
                  background: activeCat === cat.id && !activeSub ? '#e4ecf8' : 'transparent',
                  borderRight: activeCat === cat.id && !activeSub ? '2.5px solid #1d5fbf' : '2.5px solid transparent',
                }}>
                <cat.icon style={{ width: 15, height: 15 }} />
                {cat.name}
                <span className="ml-auto text-xs" style={{ color: '#8b929e' }}>{counts[cat.id] || 0}</span>
              </button>
              {catSubcats[cat.id] && activeCat === cat.id && (
                <div>
                  {catSubcats[cat.id].map(sub => (
                    <button key={sub.id} onClick={() => goSub(sub.id)}
                      className="w-full text-left py-1.5 transition"
                      style={{
                        paddingLeft: '44px', paddingRight: '20px',
                        fontSize: '12.5px',
                        color: activeSub === sub.id ? '#1d5fbf' : '#8b929e',
                        fontWeight: activeSub === sub.id ? 600 : 400,
                      }}>
                      {sub.name}
                      <span style={{ marginLeft: 6, color: '#8b929e' }}>{counts[sub.id] || 0}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10" style={{ background: '#fff', borderBottom: '1.5px solid #d6dae1' }}>
          <div className="px-6 py-3 flex items-center gap-3">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0" style={{ color: '#8b929e' }}>
              <button onClick={() => goCat('all')} className="flex items-center gap-1 hover:underline" style={{ color: '#4b5260' }}>
                <Home style={{ width: 13, height: 13 }} />
                首页
              </button>
              {currentCat && (
                <>
                  <ChevronRight style={{ width: 13, height: 13, color: '#d6dae1' }} />
                  <button onClick={() => goCat(currentCat.id)} className="hover:underline" style={{ color: '#4b5260' }}>
                    {currentCat.name}
                  </button>
                </>
              )}
              {currentSub && (
                <>
                  <ChevronRight style={{ width: 13, height: 13, color: '#d6dae1' }} />
                  <span style={{ color: '#16181d', fontWeight: 600 }}>{currentSub.name}</span>
                </>
              )}
            </nav>

            {/* Search */}
            <div className="relative" style={{ width: 240 }}>
              <Search style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8b929e' }} />
              <input
                type="text"
                placeholder="搜索笔记..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-1.5 text-sm focus:outline-none"
                style={{
                  paddingLeft: 32, paddingRight: search ? 28 : 12,
                  border: '1.5px solid #d6dae1', background: '#f6f6f3',
                  color: '#16181d',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#8b929e' }}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="mb-5">
            <h2 className="font-semibold" style={{ fontSize: 18, color: '#16181d' }}>
              {search ? `搜索：${search}` : currentSub?.name || currentCat?.name || '全部笔记'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#8b929e' }}>{filtered.length} 篇笔记</p>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {filtered.map(note => {
              const cat = categories.find(c => c.id === note.category)
              return (
                <a key={note.file}
                  href={`/notes/${note.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 transition-colors"
                  style={{
                    background: '#fff',
                    border: '1.5px solid #d6dae1',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1d5fbf' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#d6dae1' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div style={{
                      width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#e4ecf8',
                    }}>
                      {cat ? <cat.icon style={{ width: 14, height: 14, color: '#1d5fbf' }} /> : <FileText style={{ width: 14, height: 14, color: '#1d5fbf' }} />}
                    </div>
                    <ArrowLeft style={{
                      width: 14, height: 14, color: '#d6dae1',
                      transform: 'rotate(180deg)',
                    }} />
                  </div>
                  <h3 className="leading-snug" style={{ fontSize: 13.5, fontWeight: 500, color: '#16181d', lineHeight: 1.5 }}>
                    {note.title}
                  </h3>
                  {note.sub && !search && (
                    <p className="mt-1.5" style={{ fontSize: 11, color: '#8b929e' }}>
                      {currentSubList?.find(s => s.id === note.sub)?.name ||
                       (catSubcats[note.category]?.find(s => s.id === note.sub)?.name) || ''}
                    </p>
                  )}
                </a>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: '#8b929e' }}>
              没有找到匹配的笔记
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
