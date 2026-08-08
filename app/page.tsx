"use client";

import { useEffect, useMemo, useState } from "react";

type Task = { id: string; kicker: string; title: string; time: string; intro: string; actions: string[]; prompt?: string; wow?: string };

const tasks: Task[] = [
  {
    id: "brief", kicker: "VIỆC 01", title: "Chọn một công việc thật", time: "5 phút",
    intro: "Chọn một việc thầy cô đang làm lặp lại. Không bắt đầu bằng công cụ và không ôm cả chương trình.",
    actions: ["Xác định ai sẽ sử dụng Notebook.", "Chọn đúng một công việc cần hỗ trợ.", "Nêu điều AI không được tự suy đoán và điều con người vẫn quyết định."],
    prompt: `TÊN NOTEBOOK:\n\nNGƯỜI SỬ DỤNG:\nNotebook này dành cho ai?\n\nCÔNG VIỆC CẦN HỖ TRỢ:\nTôi muốn Notebook giúp mình làm việc gì?\n\nSẢN PHẨM TƯƠNG LAI:\nSau này tôi muốn tạo gì từ Notebook?\n\nGIỚI HẠN:\nNotebook không được tự suy đoán điều gì?\n\nQUYẾT ĐỊNH CỦA CON NGƯỜI:\nĐiều gì vẫn phải do tôi kiểm tra hoặc quyết định?`
  },
  {
    id: "sources", kicker: "VIỆC 02", title: "Tạo Notebook và thêm đúng ba nguồn", time: "15 phút",
    intro: "Một nguồn gốc, một nguồn thực hành và một nguồn kiểm tra là đủ để bắt đầu.",
    actions: ["Mở NotebookLM → Create new notebook.", "Đặt tên theo mẫu [Đối tượng] – [Công việc].", "Upload đúng ba nguồn: nguồn gốc, nguồn thực hành, nguồn kiểm tra.", "Mở từng nguồn, loại bản cũ, bản trùng và dữ liệu cá nhân không cần thiết."],
    prompt: `Chỉ sử dụng ba nguồn đang được chọn trong Notebook này.\n\nHãy giúp tôi xác định:\n1. Nội dung hoặc vấn đề chính mà các nguồn đang cùng hỗ trợ.\n2. Ba thông tin quan trọng nhất đối với công việc của tôi.\n3. Một điểm còn thiếu hoặc chưa rõ.\n4. Một câu hỏi tiếp theo tôi nên đặt ra.\n\nVới mỗi nhận định quan trọng, hãy dẫn nguồn. Không bổ sung kiến thức bên ngoài. Nếu chưa đủ bằng chứng, hãy nói rõ: “Chưa đủ thông tin trong các nguồn đã chọn”.`,
    wow: "WOW #1 — Mở ít nhất hai trích dẫn. Điều đáng giá không phải câu trả lời nhanh, mà là khả năng kiểm tra câu trả lời đến từ đâu."
  },
  {
    id: "citation", kicker: "VIỆC 03", title: "Kiểm tra câu trả lời đầu tiên", time: "8 phút",
    intro: "Đọc câu trả lời như một người kiểm chứng, không như người nhận đáp án sẵn.",
    actions: ["Mở hai trích dẫn và đọc đúng đoạn nguồn.", "Kiểm tra NotebookLM có diễn giải quá rộng không.", "Ghi một thông tin đúng, một điều còn nghi ngờ và một nguồn còn thiếu."],
    prompt: `MỘT THÔNG TIN ĐÚNG VÀ CÓ CĂN CỨ:\n\nMỘT THÔNG TIN TÔI VẪN CẦN KIỂM TRA:\n\nMỘT NGUỒN TÔI CẦN BỔ SUNG:`
  },
  {
    id: "map", kicker: "QUICK WIN", title: "Tạo Bản đồ khởi động", time: "7 phút",
    intro: "Ngày 1 chưa cần worksheet. Quick Win là một bản đồ ngắn cho biết Notebook đã làm được gì và cần gì tiếp theo.",
    actions: ["Chạy prompt Bản đồ khởi động.", "Kiểm tra các trích dẫn quan trọng.", "Chọn Save to Note và đặt tên DAY 1 – BẢN ĐỒ KHỞI ĐỘNG."],
    prompt: `Chỉ sử dụng các nguồn đang được chọn.\n\nHãy tạo “Bản đồ khởi động” cho Notebook này gồm:\n1. Mục đích của Notebook — một câu.\n2. Người sử dụng chính.\n3. Ba việc Notebook đã có thể hỗ trợ dựa trên nguồn hiện tại.\n4. Ba câu hỏi hữu ích tôi có thể hỏi ngay.\n5. Hai sản phẩm tôi có thể phát triển trong những ngày tiếp theo.\n6. Một nguồn còn thiếu.\n7. Ba quyết định vẫn phải do con người kiểm tra hoặc thực hiện.\n\nMỗi nhận định quan trọng phải có trích dẫn. Không tự bổ sung khả năng chưa được chứng minh bởi các nguồn.`,
    wow: "WOW #2 — Từ ba tài liệu rời rạc, thầy cô đã có một bản đồ cho cả hệ thống sẽ xây trong 12 ngày tiếp theo."
  },
  {
    id: "facebook", kicker: "NỘP BÀI", title: "Chia sẻ Day 1 trong nhóm Facebook", time: "5 phút",
    intro: "Chỉ cần hai ảnh và một bài viết ngắn. Không đăng toàn bộ tài liệu nguồn.",
    actions: ["Đính kèm ảnh Notebook có ba nguồn.", "Đính kèm ảnh Bản đồ khởi động hoặc câu trả lời có trích dẫn.", "Ẩn dữ liệu cá nhân và phản hồi một thành viên khác."],
    prompt: `[DAY 1] Họ tên – Tên Notebook\n\n1. TÊN NOTEBOOK\n[Điền]\n\n2. NOTEBOOK GIÚP TÔI LÀM VIỆC GÌ?\n[Điền một công việc cụ thể]\n\n3. BA NGUỒN ĐẦU TIÊN\n- Nguồn gốc:\n- Nguồn thực hành:\n- Nguồn kiểm tra:\n\n4. KHOẢNH KHẮC WOW\n[Điều tôi nhận ra khi mở và kiểm tra trích dẫn]\n\n5. MỘT NGUỒN CÒN THIẾU\n[Điền]\n\n6. MỘT VIỆC TÔI MUỐN NOTEBOOK HỖ TRỢ TIẾP THEO\n[Điền]`
  }
];

const peerTemplate = `Một điểm mạnh tôi nhìn thấy:\n\nMột câu hỏi tôi muốn hỏi:\n\nMột gợi ý nhỏ để sản phẩm rõ mục tiêu hơn:`;

const courseDays = [
  ["08/08", "Day 1", "Notebook Brief + Quick Win"],
  ["09/08", "Day 2", "Source Map + làm sạch nguồn"],
  ["10/08", "Day 3", "Hỏi đáp có trích dẫn"],
  ["11/08", "Day 4", "Trích xuất insight và ghi chú"],
  ["12/08", "Day 5", "So sánh và tổng hợp nhiều nguồn"],
  ["13/08", "Day 6", "Infographic từ nguồn"],
  ["14/08", "Day 7", "Worksheet có bằng chứng"],
  ["15/08", "Day 8", "Answer key + mini rubric"],
  ["16/08", "Day 9", "Phân tích và feedback"],
  ["17/08", "Day 10", "SOP + onboarding assistant"],
  ["18/08", "Day 11", "Kết nối hệ sinh thái AI"],
  ["19/08", "Day 12", "Phát triển tài sản số"],
  ["20/08", "Day 13", "Capstone: hệ thống hoàn chỉnh"],
];

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
          <p className="lead">Tạo một Notebook rõ mục đích, thêm đúng ba nguồn và kiểm tra câu trả lời đầu tiên trong 30–40 phút.</p>
          <a href="#journey" className="primary">Bắt đầu Day 1 <span>↓</span></a>
        </div>
        <div className="outcome">
          <span>KẾT QUẢ CUỐI NGÀY</span>
          <strong>01</strong><p>Notebook Brief</p>
          <strong>03</strong><p>Nguồn ban đầu</p>
          <strong>01</strong><p>Bản đồ khởi động</p>
        </div>
      </div>
    </section>

    <div className="progressWrap"><div className="progressMeta"><b>Tiến độ Day 1</b><span>{done.length}/{tasks.length} nhiệm vụ • {pct}%</span></div><div className="track"><i style={{width:`${pct}%`}}/></div></div>

    <section className="courseMap">
      <div className="courseMapHead"><div><p className="eyebrow">LỘ TRÌNH 13 NGÀY</p><h2>Một hệ thống.<br/>Mỗi ngày một lớp mới.</h2></div><p>Trang này sẽ lớn dần cùng khóa học. Sau 13 ngày, thầy cô có một trung tâm ôn tập duy nhất gồm nội dung, prompt, sản phẩm và checklist của toàn bộ hành trình.</p></div>
      <div className="dayRail">
        {courseDays.map((d,i)=><div key={d[1]} className={`dayCard ${i===0?"active":"locked"}`}>
          <div><span>{d[0]}</span><b>{d[1]}</b></div><p>{d[2]}</p><small>{i===0?"ĐANG HỌC":"SẮP MỞ"}</small>
        </div>)}
      </div>
    </section>

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
      <ul><li>Ảnh Notebook với đúng ba nguồn</li><li>Ảnh câu trả lời có trích dẫn</li><li>Ảnh Bản đồ khởi động đã lưu</li><li>Một nguồn còn thiếu cần bổ sung</li></ul>
      <div className="privacy"><b>Không đăng</b><span>Tài liệu gốc chưa có quyền chia sẻ • dữ liệu nhận diện học sinh, phụ huynh hoặc nhân sự • nội dung nội bộ nhạy cảm không cần thiết</span></div>
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
