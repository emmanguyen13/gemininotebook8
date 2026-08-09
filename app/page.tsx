"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Task = { id: string; kicker: string; title: string; time: string; intro: string; actions: string[]; prompt?: string; wow?: string };

const day1Tasks: Task[] = [
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

const day2Tasks: Task[] = [
  { id:"purpose", kicker:"VIỆC 01", title:"Nhắc lại mục đích Notebook", time:"5 phút", intro:"Nguồn chỉ có giá trị khi phục vụ một công việc rõ ràng. Hôm nay chưa cần tải thêm thật nhiều tài liệu.", actions:["Mở lại Notebook của Day 1.","Hoàn thành một câu nêu mục đích, căn cứ và sản phẩm mong muốn.","Thu hẹp mục tiêu nếu câu trả lời vẫn quá rộng."], prompt:`Tôi xây Notebook này để hỗ trợ [CÔNG VIỆC], dựa trên [CÁC LOẠI NGUỒN], nhằm tạo ra [SẢN PHẨM HOẶC QUYẾT ĐỊNH].` },
  { id:"audit", kicker:"VIỆC 02", title:"Kiểm tra ba nguồn ban đầu", time:"8 phút", intro:"Nguồn đúng quan trọng hơn nguồn nhiều. Phân loại trước khi bổ sung.", actions:["Kiểm tra mức độ liên quan, tác giả hoặc thời điểm cập nhật.","Kiểm tra file có đủ trang, dễ đọc và không chứa dữ liệu thừa.","Gắn nhãn Cốt lõi, Bổ trợ hoặc Chưa cần dùng cho từng nguồn."], prompt:`Với từng nguồn đang được chọn, hãy cho biết:\n1. Nguồn hỗ trợ quyết định hoặc công việc nào.\n2. Thông tin quan trọng đã có.\n3. Điểm còn thiếu hoặc cần kiểm tra.\n4. Phân loại: Cốt lõi / Bổ trợ / Chưa cần dùng.\n\nChỉ dựa trên nguồn. Không suy đoán.` },
  { id:"source-map", kicker:"SẢN PHẨM CHÍNH", title:"Tạo Source Map", time:"12 phút", intro:"Biến danh sách file rời rạc thành một bản đồ cho biết mỗi nguồn đang đóng vai trò gì.", actions:["Chạy prompt Source Map với ba nguồn đang chọn.","Mở ít nhất hai trích dẫn để kiểm tra.","Ghi lại nội dung chỉ xuất hiện trong một nguồn và ba loại tài liệu còn thiếu."], prompt:`Tôi đang xây Notebook này để:\n[MÔ TẢ MỤC ĐÍCH]\n\nDựa hoàn toàn trên các nguồn đang được chọn, hãy tạo SOURCE MAP gồm:\n1. Tên nguồn\n2. Nội dung chính\n3. Công việc hoặc quyết định được hỗ trợ\n4. Thông tin quan trọng đã có\n5. Thông tin còn thiếu hoặc cần kiểm tra\n6. Phân loại: Cốt lõi / Bổ trợ / Chưa cần dùng\n\nSau bảng, hãy nêu nội dung được nhiều nguồn xác nhận, nội dung chỉ xuất hiện trong một nguồn, ba loại tài liệu còn thiếu và một nguồn nên ưu tiên bổ sung. Không sử dụng kiến thức bên ngoài. Nếu không tìm thấy, ghi “Chưa có trong nguồn”. Gắn trích dẫn cho các nhận định quan trọng.`, wow:"WOW #1 — Ba file riêng lẻ trở thành một bản đồ về vai trò, khoảng trống và mối liên hệ." },
  { id:"minimum-set", kicker:"QUICK WIN", title:"Xây bộ nguồn tối thiểu", time:"10 phút", intro:"Minimum Viable Source Set là bộ nguồn nhỏ nhất nhưng đủ để bắt đầu một công việc thật.", actions:["Chọn một công việc cụ thể cần hoàn thành.","Yêu cầu NotebookLM xác định bộ nguồn tối thiểu.","Chọn một hành động 15 phút để cải thiện bộ nguồn."], prompt:`Dựa trên Source Map vừa tạo, hãy đề xuất MINIMUM VIABLE SOURCE SET để tôi có thể:\n[CÔNG VIỆC CỤ THỂ]\n\nVới mỗi nguồn, trình bày: tên hoặc loại nguồn; vì sao cần thiết; quyết định được hỗ trợ; rủi ro nếu thiếu; trạng thái Đã có / Cần bổ sung / Cần kiểm tra. Cuối cùng, đề xuất một hành động nhỏ có thể hoàn thành trong 15 phút. Chỉ dựa trên dữ liệu trong Notebook.`, wow:"WOW #2 — Biết chính xác cần thêm gì, thay vì thu thập tài liệu không có điểm dừng." },
  { id:"compare", kicker:"KIỂM CHỨNG", title:"So sánh chất lượng câu trả lời", time:"5 phút", intro:"Hỏi lại một câu của Day 1, lần này chỉ chọn các nguồn Cốt lõi.", actions:["Chọn riêng các nguồn Cốt lõi.","Chạy lại một câu hỏi đã dùng ở Day 1.","So sánh độ tập trung, trích dẫn và phần còn thiếu."], prompt:`Dựa riêng trên các nguồn Cốt lõi đang được chọn, hãy trả lời:\n[CÂU HỎI CẦN GIẢI QUYẾT]\n\nGắn trích dẫn cho từng nhận định quan trọng; phân biệt điều được xác nhận và điều chưa đủ bằng chứng; không suy đoán; nêu một thông tin còn thiếu và một bước tiếp theo nhỏ.` },
  { id:"facebook2", kicker:"NỘP BÀI", title:"Chia sẻ Source Map", time:"5 phút", intro:"Đăng một ảnh minh chứng và một bài viết ngắn. Không chia sẻ file nguồn gốc.", actions:["Đính kèm Source Map hoặc bộ nguồn tối thiểu.","Nêu một nguồn Cốt lõi và một nguồn còn thiếu.","Ẩn dữ liệu nhạy cảm và dùng đủ hashtag."], prompt:`[DAY 2] Họ tên – SOURCE MAP\n\n1. TÊN NOTEBOOK\n[Điền]\n\n2. CÔNG VIỆC NOTEBOOK HỖ TRỢ\n[Điền]\n\n3. NGUỒN CỐT LÕI VÀ LÝ DO\n[Điền]\n\n4. MỘT NGUỒN CÒN THIẾU\n[Điền]\n\n5. ĐIỀU KHIẾN TÔI BẤT NGỜ\n[Điền]\n\n6. BƯỚC TIẾP THEO\n[Điền]\n\n#GeminiNotebookMasteryK8 #Day2 #SourceMap` }
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

export function CourseExperience({ initialDay = 2 }: { initialDay?: 1|2 }) {
  const day = initialDay;
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string>("purpose");
  const tasks = day===1 ? day1Tasks : day2Tasks;
  useEffect(()=>{const s=localStorage.getItem(`gnm-day${day}`); setDone(s?JSON.parse(s):[]); setOpen(day===1?"brief":"purpose")},[day]);
  useEffect(()=>{localStorage.setItem(`gnm-day${day}`,JSON.stringify(done))},[done,day]);
  const pct=useMemo(()=>Math.round(done.length/tasks.length*100),[done]);
  const toggle=(id:string)=>setDone(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);

  return <main>
    <section className="hero">
      <nav><span className="brand">GEMINI NOTEBOOK MASTERY K8</span><span>DAY 0{day} / 13</span></nav>
      <div className="heroGrid">
        <div>
          <p className="eyebrow">{day===1?"BẮT ĐẦU TỪ CÔNG VIỆC THẬT":"CHỌN ĐÚNG NGUỒN TRƯỚC KHI HỎI AI"}</p>
          <h1>{day===1?<>Tạo Notebook đầu tiên.<br/><em>Có Quick Win ngay hôm nay.</em></>:<>Xây Source Map.<br/><em>Biết mình có gì và còn thiếu gì.</em></>}</h1>
          <p className="lead">{day===1?"Tạo một Notebook rõ mục đích, thêm đúng ba nguồn và kiểm tra câu trả lời đầu tiên trong 30–40 phút.":"Kiểm tra ba nguồn ban đầu, phân loại vai trò và tạo bộ nguồn tối thiểu trong 30–40 phút."}</p>
          <a href="#journey" className="primary">Bắt đầu Day {day} <span>↓</span></a>
        </div>
        <div className="outcome">
          <span>KẾT QUẢ CUỐI NGÀY</span>
          {day===1?<><strong>01</strong><p>Notebook Brief</p><strong>03</strong><p>Nguồn ban đầu</p><strong>01</strong><p>Bản đồ khởi động</p></>:<><strong>01</strong><p>Source Map</p><strong>03</strong><p>Nhóm phân loại nguồn</p><strong>01</strong><p>Bộ nguồn tối thiểu</p></>}
        </div>
      </div>
    </section>

    <div className="progressWrap"><div className="progressMeta"><b>Tiến độ Day {day}</b><span>{done.length}/{tasks.length} nhiệm vụ • {pct}%</span></div><div className="track"><i style={{width:`${pct}%`}}/></div></div>

    <section className="courseMap">
      <div className="courseMapHead"><div><p className="eyebrow">LỘ TRÌNH 13 NGÀY</p><h2>Một hệ thống.<br/>Mỗi ngày một lớp mới.</h2></div><p>Trang này sẽ lớn dần cùng khóa học. Sau 13 ngày, thầy cô có một trung tâm ôn tập duy nhất gồm nội dung, prompt, sản phẩm và checklist của toàn bộ hành trình.</p></div>
      <div className="dayRail">
        {courseDays.map((d,i)=>i<2?<Link key={d[1]} href={`/day-${i+1}/#journey`} className={`dayCard ${i===day-1?"active":"available"}`}>
          <div><span>{d[0]}</span><b>{d[1]}</b></div><p>{d[2]}</p><small>{i===day-1?"ĐANG MỞ":"BẤM ĐỂ XEM"}</small>
        </Link>:<div key={d[1]} className="dayCard locked"><div><span>{d[0]}</span><b>{d[1]}</b></div><p>{d[2]}</p><small>SẮP MỞ</small></div>)}
      </div>
    </section>

    <section className="principle">
      <p>NGUYÊN TẮC NGÀY {day}</p>
      <h2>{day===1?<>Đừng tạo Notebook theo tên công cụ.<br/>Hãy tạo Notebook theo <em>một công việc cần giải quyết.</em></>:<>Đừng đánh giá Notebook bằng số lượng tài liệu.<br/>Hãy chọn <em>đúng nguồn cho đúng quyết định.</em></>}</h2>
      <div className="chain">{(day===1?["Nguồn","Mục tiêu","Nhiệm vụ","Bằng chứng"]:["Mục đích","Kiểm tra","Phân loại","Khoảng trống"]).map((x,i)=><span key={x}>{i>0&&<b>→ </b>}{x}</span>)}</div>
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
      <div><p className="eyebrow">MINH CHỨNG CẦN ĐÍNH KÈM</p><h2>{day===1?"Chọn ít nhất hai.":"Một ảnh, đủ bằng chứng."}</h2></div>
      {day===1?<ul><li>Ảnh Notebook với đúng ba nguồn</li><li>Ảnh câu trả lời có trích dẫn</li><li>Ảnh Bản đồ khởi động đã lưu</li><li>Một nguồn còn thiếu cần bổ sung</li></ul>:<ul><li>Ảnh Source Map hoặc bộ nguồn tối thiểu</li><li>Một nguồn Cốt lõi và lý do</li><li>Một nguồn còn thiếu</li><li>Một bước tiếp theo trong 15 phút</li></ul>}
      <div className="privacy"><b>Không đăng</b><span>Tài liệu gốc chưa có quyền chia sẻ • dữ liệu nhận diện học sinh, phụ huynh hoặc nhân sự • nội dung nội bộ nhạy cảm không cần thiết</span></div>
    </section>

    <section className="peer">
      <div><p className="eyebrow">TƯƠNG TÁC CỘNG ĐỒNG</p><h2>Đừng chỉ viết<br/>“Hay quá!”</h2><p>Phản hồi ít nhất một bài để giúp đồng đội nhìn rõ hơn mối liên hệ giữa mục tiêu và bằng chứng.</p></div>
      <div className="peerCard"><pre>{peerTemplate}</pre><CopyButton text={peerTemplate}/></div>
    </section>

    <section className="finish">
      <p>DAY {day} COMPLETE</p><h2>{pct===100?`Thầy cô đã hoàn thành Day ${day}.`:"Quick Win không cần hoàn hảo."}</h2>
      <p>Nó cần đủ nhỏ để hoàn thành, đủ thật để sử dụng và đủ rõ để kiểm tra.</p>
      <div className="finishBar"><i style={{width:`${pct}%`}}/><span>{pct}%</span></div>
      <p className="next">{day===1?<>Tiếp theo: làm sạch bộ nguồn và xây <b>Source Map</b>.</>:<>Tiếp theo: đặt câu hỏi có cấu trúc và kiểm tra <b>trích dẫn</b>.</>}</p>
    </section>

    <footer><b>Emma Nguyễn • TECH4EDU</b><span>Gemini Notebook Mastery K8</span></footer>
  </main>
}

export default function Home(){ return <CourseExperience initialDay={2}/> }
