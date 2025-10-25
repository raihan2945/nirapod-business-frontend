// "use client"

// import dynamic from "next/dynamic"
// import { useMemo } from "react"
// // @ts-ignore
// import "react-quill-new/dist/quill.snow.css"

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

// interface RichTextEditorProps {
//   value: string
//   onChange: (content: string) => void
//   placeholder?: string
// }

// export default function RichTextEditor({
//   value,
//   onChange,
//   placeholder = "Write your content here...",
// }: RichTextEditorProps) {
//   const modules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline", "strike"],
//         ["blockquote", "code-block"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link", "image"],
//         ["clean"],
//       ],
//     }),
//     [],
//   )

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "code-block",
//     "list",
//     "bullet",
//     "link",
//     "image",
//   ]

//   return (
//     <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
//       <ReactQuill
//         theme="snow"
//         value={value}
//         onChange={onChange}
//         modules={modules}
//         formats={formats}
//         placeholder={placeholder}
//         className="min-h-96"
//       />
//     </div>
//   )
// }
