"use client";

import { useEffect, useMemo, useState } from "react";

type Task = { id: string; kicker: string; title: string; time: string; intro: string; actions: string[]; prompt?: string; wow?: string };

const tasks: Task[] = [
  {
    id: "brief", kicker: "NHIỆM VỤ 01", title: "Chọn một Notebook đáng để xây", time: "8 phút",
    intro: "Đừng tạo Notebook theo tên công cụ. Hãy tạo Notebook theo một công việc đang lấy thời gian của thầy cô.",
    actions: ["Chọn một công việc lặp lại hoặc thường phải tổng hợp nhiều tài liệu.", "Xác định rõ ai sẽ sử dụng Notebook.", "Đặt tên theo công việc cụ thể, không đặt tên quá rộng."],
    prompt: `TÊN NOTEBOOK:\n\n1. Người sử dụng Notebook này là ai?\n2. Notebook cần hỗ trợ công việc gì?\n3. Ba câu hỏi quan trọng Notebook phải trả lời được?\n4. Sản phẩm tôi muốn tạo từ Notebook?\n5. Những nguồn tôi đang có?\n6. Những thông tin AI không được tự suy đoán?\n7. Những quyết định cuối cùng vẫn phải do con người thực hiện?`
  },
  {
    id: "sources", kicker: "NHIỆM VỤ 02", title: "Tạo bộ nguồn tối thiểu", time: "10 phút",
    intro: "Một bộ nguồn nhỏ nhưng rõ ràng có giá trị hơn một Notebook chứa mọi thứ.",
    actions: ["Tạo New notebook và đặt tên theo Notebook Brief.", "Thêm 3–5 nguồn chính thức, đúng phiên bản và trực tiếp liên quan.", "Loại bản trùng, bản cũ và dữ liệu cá nhân không cần thiết."],
    prompt: `Chỉ sử dụng các nguồn hiện có trong Notebook này.\n\nHãy kiểm tra bộ nguồn theo bốn mục:\n1. Các chủ đề và thông tin chính hiện có.\n2. Những câu hỏi bộ nguồn đã đủ khả năng trả lời.\n3. Những thông tin còn thiếu để phục vụ mục tiêu của Notebook.\n4. Những nguồn trùng lặp, mâu thuẫn hoặc cần kiểm tra lại.\n\nVới mỗi nhận định quan trọng, hãy chỉ rõ nguồn liên quan. Không tự bổ sung kiến thức bên ngoài. Nếu chưa đủ bằng chứng, hãy nói: “Chưa đủ thông tin trong nguồn”.`,
    wow: "WOW #1 — Bấm mở ít nhất hai trích dẫn. Giá trị không nằm ở câu trả lời nhanh, mà ở khả năng nhìn thấy câu trả lời đến từ đâu."
  },
  {
    id: "focus", kicker: "NHIỆM VỤ 03", title: "Chọn một nội dung thật nhỏ", time: "7 phút",
    intro: "Quick Win ngày 1 chỉ cần đủ nhỏ để hoàn thành và đủ thật để sử dụng.",
    actions: ["Chọn một điểm ngữ pháp, nhóm từ, chức năng giao tiếp hoặc một phần quy trình.", "Không chọn cả Unit, cả khóa học hoặc toàn bộ hệ thống.", "Xác định một bằng chứng quan sát được."],
    prompt: `Chỉ sử dụng các nguồn trong Notebook này.\n\nTừ các nguồn hiện có, hãy chọn một nội dung nhỏ có thể chuyển thành hoạt động thực hành trong 10–15 phút.\n\nTrình bày:\n1. Nội dung trọng tâm.\n2. Người học hoặc người sử dụng phù hợp.\n3. Điều họ cần hiểu hoặc làm được.\n4. Ba thông tin quan trọng từ nguồn.\n5. Một lỗi hoặc hiểu nhầm có thể xảy ra.\n6. Một nhiệm vụ ngắn tạo ra bằng chứng quan sát được.\n\nVới mỗi nhận định quan trọng, hãy dẫn nguồn. Nếu chưa đủ thông tin, ghi rõ “Chưa đủ bằng chứng trong nguồn”.`
  },
  {
    id: "worksheet", kicker: "QUICK WIN", title: "Tạo mini worksheet 10–15 phút", time: "18 phút",
    intro: "Biến một tài liệu cũ thành sản phẩm có mục tiêu, tiến trình và bằng chứng học tập.",
    actions: ["Điền người học, mục tiêu và giới hạn trước khi chạy prompt.", "Kiểm tra mục tiêu trước; chỉ chỉnh hình thức sau.", "Giữ NOTICE → PRACTICE → USE → CHECK."],
    prompt: `Chỉ sử dụng các nguồn trong Notebook này và nội dung trọng tâm đã được xác nhận.\n\nHãy tạo một mini worksheet có thể hoàn thành trong 10–15 phút.\n\nĐối tượng: [độ tuổi/trình độ]\nMục tiêu: Sau hoạt động, người học có thể [hành động quan sát được].\n\nA. NOTICE — nhận ra nội dung trọng tâm trong ngữ cảnh.\nB. PRACTICE — 3–5 câu thực hành có hỗ trợ.\nC. USE — tự tạo câu trả lời hoặc áp dụng vào tình huống mới.\nD. CHECK — một exit ticket tạo ra bằng chứng rõ ràng.\n\nViết instruction trực tiếp cho người học. Không thêm kiến thức ngoài nguồn. Không đưa đáp án vào worksheet. Sau mỗi phần, ghi bằng chứng giáo viên cần quan sát và đánh dấu nội dung vẫn cần giáo viên kiểm tra.`,
    wow: "WOW #2 — Một nguồn đang nằm trong thư mục đã trở thành một worksheet có thể chạy thử. Hãy kiểm tra: mục tiêu và CHECK có khớp nhau không?"
  },
  {
    id: "key", kicker: "NHIỆM VỤ 05", title: "Tạo key hoặc mini rubric", time: "12 phút",
    intro: "Câu đóng cần key. Nhiệm vụ mở cần tiêu chí. Giáo viên vẫn quyết định đáp án chấp nhận được và điểm cuối cùng.",
    actions: ["Phân loại câu CLOSED, SEMI-OPEN hoặc OPEN.", "Kiểm tra phương án hợp lệ khác.", "Không để AI tính hoặc quyết định điểm cuối cùng."],
    prompt: `Dựa trên worksheet đã được tôi xác nhận:\n\n1. Phân loại từng câu: CLOSED, SEMI-OPEN hoặc OPEN.\n2. Với CLOSED: cung cấp đáp án và giải thích dựa trên nguồn.\n3. Với SEMI-OPEN: liệt kê phương án hợp lệ và giới hạn chấp nhận.\n4. Với OPEN: tạo mini rubric tối đa ba tiêu chí, mô tả bằng chứng quan sát được.\n5. Đánh dấu câu vẫn cần giáo viên phán đoán.\n\nKhông tính hoặc quyết định điểm cuối cùng. Không thêm tiêu chí chưa được dạy hoặc chưa xuất hiện trong nhiệm vụ.`,
    wow: "WOW #3 — Thầy cô không chỉ có một worksheet đẹp; thầy cô có một gói nhỏ gồm nguồn, nhiệm vụ, bằng chứng và cách kiểm tra."
  },
  {
    id: "facebook", kicker: "NỘP BÀI", title: "Chia sẻ Quick Win trong nhóm Facebook", time: "10 phút",
    intro: "Đăng sản phẩm đủ để cộng đồng nhìn thấy mối liên hệ Nguồn → Mục tiêu → Nhiệm vụ → Bằng chứng.",
    actions: ["Đính kèm ít nhất hai minh chứng.", "Ẩn dữ liệu cá nhân và không đăng tài liệu gốc khi chưa có quyền.", "Phản hồi một thành viên bằng nhận xét có chất lượng."],
    prompt: `[DAY 1] Họ tên – Tên Notebook – Quick Win\n\n1. TÊN NOTEBOOK\n[Điền]\n\n2. NGƯỜI SỬ DỤNG\n[Điền]\n\n3. CÔNG VIỆC NOTEBOOK HỖ TRỢ\n[Điền]\n\n4. BA NGUỒN ĐẦU TIÊN\n- Nguồn 1:\n- Nguồn 2:\n- Nguồn 3:\n\n5. QUICK WIN NGÀY 1\nTôi đã tạo: [mini worksheet / infographic / tài sản khác]\n\n6. KHOẢNH KHẮC WOW CỦA TÔI\n[Điền]\n\n7. ĐIỂM TÔI ĐÃ KIỂM TRA BẰNG CON NGƯỜI\n[Trích dẫn, mục tiêu, câu hỏi, đáp án, ngôn ngữ, dữ liệu…]\n\n8. MỘT ĐIỀU TÔI MUỐN CẢI THIỆN NGÀY MAI\n[Điền]`
  }
];

const peerTemplate = `Một điểm mạnh tôi nhìn thấy:\n\nMột câu hỏi tôi muốn hỏi:\n\nMột gợi ý nhỏ để sản phẩm rõ mục tiêu hơn:`;

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <button className="copy" onClick={async()=>{await navigator.clipboard.writeText(text);setDone(true);setTimeout(()=>setDone(false),1400)}}>{done ? "Đã sao chép ✓" : "Sao chép prompt"}</button>
}

export default function Home() {
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string>("brief");
  useEffect(()=>{const s=localStorage.getItem("gnm-day1"); if(s) setDone(JSON.parse(s))},[]);
  useEffect(()=>{localStorage.setItem("gnm-day1",JSON.stringify(done))},[done]);
  const pct=useMemo(()=>Math.round(done.length/tasks.length*100),[done]);
  const toggle=(id:string)=>setDone(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);

  return <main>
    <section className="hero">
      <nav><span className="brand">GEMINI NOTEBOOK MASTERY K8</span><span>DAY 01 / 13</span></nav>
      <div className="heroGrid">
        <div>
          <p className="eyebrow">BẮT ĐẦU TỪ CÔNG VIỆC THẬT</p>
          <h1>Tạo Notebook đầu tiên.<br/><em>Có Quick Win ngay hôm nay.</em></h1>
          <p className="lead">Xây bộ nguồn nhỏ, kiểm tra trích dẫn và biến một nội dung thật thành mini worksheet 10–15 phút.</p>
          <a href="#journey" className="primary">Bắt đầu Day 1 <span>↓</span></a>
        </div>
        <div className="outcome">
          <span>KẾT QUẢ CUỐI NGÀY</span>
          <strong>01</strong><p>Notebook Brief</p>
          <strong>3–5</strong><p>Nguồn ban đầu</p>
          <strong>01</strong><p>Mini worksheet + key</p>
        </div>
      </div>
    </section>

    <div className="progressWrap"><div className="progressMeta"><b>Tiến độ Day 1</b><span>{done.length}/{tasks.length} nhiệm vụ • {pct}%</span></div><div className="track"><i style={{width:`${pct}%`}}/></div></div>

    <section className="principle">
      <p>NGUYÊN TẮC NGÀY 1</p>
      <h2>Đừng tạo Notebook theo tên công cụ.<br/>Hãy tạo Notebook theo <em>một công việc cần giải quyết.</em></h2>
      <div className="chain"><span>Nguồn</span><b>→</b><span>Mục tiêu</span><b>→</b><span>Nhiệm vụ</span><b>→</b><span>Bằng chứng</span></div>
    </section>

    <section id="journey" className="journey">
      <div className="sectionHead"><p>LỘ TRÌNH THỰC HÀNH</p><h2>Hoàn thành từng bước.<br/>Không cần hoàn hảo.</h2></div>
      <div className="tasks">
        {tasks.map((t,i)=><article key={t.id} className={`task ${open===t.id?"isOpen":""} ${done.includes(t.id)?"isDone":""}`}>
          <button className="taskHead" onClick={()=>setOpen(open===t.id?"":t.id)} aria-expanded={open===t.id}>
            <span className="num">{String(i+1).padStart(2,"0")}</span><span className="taskTitle"><small>{t.kicker} • {t.time}</small><b>{t.title}</b></span><span className="chev">{open===t.id?"−":"+"}</span>
          </button>
          {open===t.id&&<div className="taskBody">
            <p className="intro">{t.intro}</p>
            <div className="bodyGrid"><div><h3>Thực hiện</h3><ol>{t.actions.map(a=><li key={a}>{a}</li>)}</ol></div>{t.prompt&&<div className="prompt"><div className="promptTop"><span>PROMPT COPY-READY</span><CopyButton text={t.prompt}/></div><pre>{t.prompt}</pre></div>}</div>
            {t.wow&&<div className="wow">✦ {t.wow}</div>}
            <button className="complete" onClick={()=>toggle(t.id)}>{done.includes(t.id)?"Đã hoàn thành ✓":"Đánh dấu hoàn thành"}</button>
          </div>}
        </article>)}
      </div>
    </section>

    <section className="proof">
      <div><p className="eyebrow">MINH CHỨNG CẦN ĐÍNH KÈM</p><h2>Chọn ít nhất hai.</h2></div>
      <ul><li>Ảnh Notebook và danh sách nguồn</li><li>Ảnh câu trả lời có trích dẫn</li><li>Ảnh hoặc PDF mini worksheet</li><li>Ảnh answer key hoặc mini rubric</li></ul>
      <div className="privacy"><b>Không đăng</b><span>Tài liệu gốc chưa có quyền chia sẻ • dữ liệu nhận diện học sinh/phụ huynh • answer key trong bản dành cho học sinh</span></div>
    </section>

    <section className="peer">
      <div><p className="eyebrow">TƯƠNG TÁC CỘNG ĐỒNG</p><h2>Đừng chỉ viết<br/>“Hay quá!”</h2><p>Phản hồi ít nhất một bài để giúp đồng đội nhìn rõ hơn mối liên hệ giữa mục tiêu và bằng chứng.</p></div>
      <div className="peerCard"><pre>{peerTemplate}</pre><CopyButton text={peerTemplate}/></div>
    </section>

    <section className="finish">
      <p>DAY 1 COMPLETE</p><h2>{pct===100?"Thầy cô đã hoàn thành Day 1.":"Quick Win không cần hoàn hảo."}</h2>
      <p>Nó cần đủ nhỏ để hoàn thành, đủ thật để sử dụng và đủ rõ để kiểm tra.</p>
      <div className="finishBar"><i style={{width:`${pct}%`}}/><span>{pct}%</span></div>
      <p className="next">Ngày mai: làm sạch bộ nguồn và xây <b>Source Map</b>.</p>
    </section>

    <footer><b>Emma Nguyễn • TECH4EDU</b><span>Gemini Notebook Mastery K8</span></footer>
  </main>
}
