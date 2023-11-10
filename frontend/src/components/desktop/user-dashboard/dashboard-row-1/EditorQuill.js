import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { url } from "./../../../../store/actions/config";

// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";
import QuillResize from "quill-resize-module";
import isEmpty from "../../../../store/validations/is-empty";

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/resize", QuillResize);

EditorQuill.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

export default function EditorQuill({ emailEditorState }) {
  const [editorFinalHtml, seteditorFinalHtml] = useState("");

  var userData = JSON.parse(localStorage.getItem("Data"));
  const modules = {
    // #3 Add "image" to the toolbar
    toolbar: [
      ["bold", "italic", "underline", "strike", "image"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
    // # 4 Add module and upload function
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);

          fetch(
            `https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22`,
            {
              method: "POST",
              body: formData,
              // headers: {
              //   "Content-Type": "application/json",
              //   Authorization: `Bearer ${userData.token}`,
              // },
            }
          )
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              resolve(result.data.url);
            })
            .catch((error) => {
              reject("Upload failed");
              console.error("Error:", error);
            });
        });
      },
    },
    // resize: {
    //   styles: {
    //     // ...
    //     toolbar: {
    //       backgroundColor: "black",
    //       border: "none",
    //       color: "#ffffff",
    //       // other camelCase styles for size display
    //     },
    //     toolbarButton: {
    //       // ...
    //     },
    //     toolbarButtonSvg: {
    //       // ...
    //     },
    //   },
    //   modules: ["Resize", "DisplaySize", "Toolbar"],
    // },
  };
  const onChange = (html) => {
    localStorage.setItem("createTemplateMailBody", JSON.stringify(html));

    // console.log(html);
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
  ];

  return (
    <>
      <ReactQuill
        //   defaultValue={`
        //   <p><img src="https://i.ibb.co/C6fDG5N/arrow-icon-down-25.png" data-size="1600,1600" style="width: 117px;"></p>
        // `}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        value={emailEditorState}
      ></ReactQuill>
      {/* <ReactQuill
        theme="snow"
        modules={modules}
        value={emailEditorState}
        onChange={onChange}
        placeholder={placeholder}
        // modules={EditorQuill.modules}
      >
        <div className="my-editing-area" />
      </ReactQuill> */}

      {/* <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={emailEditorState}
        // onChange={onChange}
      >
        <div className="my-editing-area" />
      </ReactQuill> */}
    </>
  );
}
