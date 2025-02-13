"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import {
  ArrowLeft,
  RotateCcw,
  RotateCw,
  Scissors,
  ChevronDown,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Bot,
  CheckSquare,
  Palette,
  Type,
  Rocket,
} from "lucide-react";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";

interface ColorType {
  name: string;
  color: string;
}

const RichTextEditor = () => {
  // 1. Define constants first (move these to the top)
  const colors: ColorType[] = [
    { name: "Default", color: "#000000" },
    { name: "Gray", color: "#6B7280" },
    { name: "Red", color: "#EF4444" },
    { name: "Yellow", color: "#F59E0B" },
    { name: "Green", color: "#10B981" },
    { name: "Blue", color: "#3B82F6" },
    { name: "Purple", color: "#8B5CF6" },
    { name: "Pink", color: "#EC4899" },
    { name: "Dark Blue", color: "#1E40AF" },
    { name: "Dark Green", color: "#047857" },
  ];

  const backgroundColors = [
    { name: "None", color: "transparent" },
    { name: "Light Gray", color: "#F3F4F6" },
    { name: "Light Red", color: "#FEE2E2" },
    { name: "Light Yellow", color: "#FEF3C7" },
    { name: "Light Green", color: "#D1FAE5" },
    { name: "Light Blue", color: "#DBEAFE" },
    { name: "Light Purple", color: "#EDE9FE" },
    { name: "Light Pink", color: "#FCE7F3" },
    { name: "Cyan", color: "#CFFAFE" },
    { name: "Orange", color: "#FFEDD5" },
  ];

  // 2. All state declarations
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isAlignmentDropdownOpen, setIsAlignmentDropdownOpen] = useState(false);
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const [isTextColorDropdownOpen, setIsTextColorDropdownOpen] = useState(false);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [isBackgroundColorDropdownOpen, setIsBackgroundColorDropdownOpen] =
    useState(false);

  // 3. Editor declaration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      TextStyle,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: true, // Change this to true to make links clickable
        HTMLAttributes: {
          // Add default attributes for links
          class: "text-blue-600 underline hover:text-blue-800",
          rel: "noopener noreferrer", // Security best practice for external links
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Color.configure({ types: [TextStyle.name] }),
      Highlight.configure({ multicolor: true }),
    ],
    content: `<h1>Chapter 1, The History</h1>
    <p>The city, a kaleidoscope of digital billboards and holographic projections, is in a state of perpetual twilight, casting an ethereal glow on its inhabitants.</p>
    <p>X_AE_B-22's mission is to locate the source of a mysterious signal that has been disrupting the neural networks of both humans and synthetics alike. This signal, rumored to be the work of a rogue faction known as the Shadow Code, has the potential to rewrite the very fabric of consciousness.</p>
    <p>X_AE_B-22's pursuit leads it to the subterranean depths of the city, where forgotten tunnels and abandoned cyber-labs hide secrets long buried by time. Each step forward unravels more of the intricate web spun by the Shadow Code, revealing a plot to seize control of the entire megacity.</p>`,
  });

  // 4. useEffect hooks
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsStyleDropdownOpen(false);
        setIsAlignmentDropdownOpen(false);
        setIsListDropdownOpen(false);
        setIsTextColorDropdownOpen(false);
        setIsBackgroundColorDropdownOpen(false);
        setIsImageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. All callback functions
  const setTextColor = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
      setIsTextColorDropdownOpen(false);
    },
    [editor]
  );

  const setBackgroundColor = useCallback(
    (color: any) => {
      editor?.chain().focus().setHighlight({ color }).run();
      setIsBackgroundColorDropdownOpen(false);
    },
    [editor]
  );

  // 6. Early return
  if (!editor) {
    return null;
  }

  // 7. Helper functions (not hooks)
  const getCurrentTextStyle = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  };

  const addLink = () => {
    // Create modal container
    const modalContent = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-5 rounded-lg w-[500px] max-w-[90%] shadow-lg">
          <h3 class="text-lg font-bold mb-4">Insert Link</h3>
          
          <!-- URL Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input 
              type="url" 
              id="linkUrl"
              placeholder="Enter URL" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <!-- Text Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
            <input 
              type="text" 
              id="linkText"
              placeholder="Enter link text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
  
          <!-- Checkbox for new tab -->
          <div class="flex items-center mb-4">
            <input
              type="checkbox"
              id="openInNewTab"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label for="openInNewTab" class="ml-2 text-sm text-gray-700">
              Open in new tab
            </label>
          </div>
          
          <!-- Buttons -->
          <div class="flex justify-end space-x-2">
            <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" id="cancelBtn">
              Cancel
            </button>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" id="insertBtn">
              Insert
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert modal into DOM
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalContent;
    const firstChild = modalContainer.firstElementChild;
    if (firstChild) {
      document.body.appendChild(firstChild);
    }

    // Get references to elements
    const modalBackdrop = document.querySelector(".fixed.inset-0");
    if (!modalBackdrop) {
      console.error("Modal backdrop not found");
      return;
    }

    const urlInput = modalBackdrop.querySelector(
      "#linkUrl"
    ) as HTMLInputElement;
    const textInput = modalBackdrop.querySelector(
      "#linkText"
    ) as HTMLInputElement;
    const checkbox = modalBackdrop.querySelector(
      "#openInNewTab"
    ) as HTMLInputElement;
    const cancelBtn = modalBackdrop.querySelector("#cancelBtn");
    const insertBtn = modalBackdrop.querySelector("#insertBtn");

    // Get selected text and URL if a link is already present
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    const existingLink = editor.getAttributes("link").href;

    // Store the original content at the selection
    const originalContent = selectedText;

    // Pre-fill inputs if there's existing content
    if (selectedText) {
      textInput.value = selectedText;
    }
    if (existingLink) {
      urlInput.value = existingLink;
    }

    // Function to update the preview in the editor
    const updateEditorPreview = () => {
      const url = urlInput.value;
      const text = textInput.value || url;

      if (text) {
        // Remove any existing content at the selection
        if (selectedText) {
          editor.chain().focus().deleteSelection().run();
        }

        // Insert preview link
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: "text",
              marks: [
                {
                  type: "link",
                  attrs: {
                    href: url || "#",
                    target: checkbox.checked ? "_blank" : null,
                    rel: checkbox.checked ? "noopener noreferrer" : null,
                    class: "text-blue-600 underline hover:text-blue-800",
                  },
                },
              ],
              text: text,
            },
          ])
          .run();
      }
    };

    // Update preview when inputs change
    urlInput.addEventListener("input", updateEditorPreview);
    textInput.addEventListener("input", updateEditorPreview);
    checkbox.addEventListener("change", updateEditorPreview);

    // Initial preview update
    updateEditorPreview();

    // Add event listeners
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        // Restore original content
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(originalContent)
          .run();
        modalBackdrop.remove();
      });
    }

    if (!insertBtn) {
      console.error("Insert button not found");
      return;
    }

    insertBtn.addEventListener("click", () => {
      const url = urlInput.value;
      const text = textInput.value;

      if (url) {
        // The preview is already in place, just need to ensure the final state
        editor
          .chain()
          .focus()
          .setLink({
            href: url,
            target: checkbox.checked ? "_blank" : null,
            rel: checkbox.checked ? "noopener noreferrer" : null,
            class: "text-blue-600 underline hover:text-blue-800",
          })
          .run();
      }
      modalBackdrop.remove();
    });

    // Handle Enter key
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        (insertBtn as HTMLElement).click();
      }
    };
    urlInput.addEventListener("keydown", handleEnter);
    textInput.addEventListener("keydown", handleEnter);

    // Focus URL input on open
    urlInput.focus();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          editor
            .chain()
            .focus()
            .setImage({ src: e.target.result.toString() })
            .run();
        }
      };
      reader.readAsDataURL(file);
    }
    setIsImageDropdownOpen(false);
  };

  const handleImageByUrl = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setIsImageDropdownOpen(false);
  };

  const handleDragDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          editor
            .chain()
            .focus()
            .setImage({ src: e.target.result.toString() })
            .run();
        }
      };
      reader.readAsDataURL(file);
    }
    setIsImageDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b p-4 flex-nowrap">
          {/* History and Clipboard Group */}
          <div className="flex items-center space-x-1">
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <RotateCcw size={18} />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RotateCw size={18} />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          {/* AI Assistant Button */}
          <button className="p-2 hover:bg-gray-100 rounded">
            <Bot size={18} />
          </button>

          <div className="h-6 w-px bg-gray-300" />

          {/* Copy Button */}
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => {
              const text = editor.view.state.doc.textContent;
              navigator.clipboard.writeText(text);
            }}
          >
            <Scissors size={18} />
          </button>

          <div className="h-6 w-px bg-gray-300" />

          {/* Text Style Dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded"
              onClick={() => {
                setIsStyleDropdownOpen(!isStyleDropdownOpen);
                setIsAlignmentDropdownOpen(false);
              }}
            >
              <span>{getCurrentTextStyle()}</span>
              <ChevronDown size={16} />
            </button>
            {isStyleDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    editor.isActive("paragraph") ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setIsStyleDropdownOpen(false);
                  }}
                >
                  Paragraph
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    editor.isActive("heading", { level: 1 })
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setIsStyleDropdownOpen(false);
                  }}
                >
                  Heading 1
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    editor.isActive("heading", { level: 2 })
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setIsStyleDropdownOpen(false);
                  }}
                >
                  Heading 2
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    editor.isActive("heading", { level: 3 })
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    setIsStyleDropdownOpen(false);
                  }}
                >
                  Heading 3
                </button>
              </div>
            )}
          </div>
          <div className="h-6 w-px bg-gray-300" />

          {/* Text Formatting */}
          <div className="flex items-center space-x-1">
            <button
              className={`p-2 hover:bg-gray-100 rounded ${
                editor.isActive("bold") ? "bg-gray-200" : ""
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={18} />
            </button>
            <button
              className={`p-2 hover:bg-gray-100 rounded ${
                editor.isActive("italic") ? "bg-gray-200" : ""
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={18} />
            </button>
            <button
              className={`p-2 hover:bg-gray-100 rounded ${
                editor.isActive("underline") ? "bg-gray-200" : ""
              }`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon size={18} />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          {/* Links and Media */}
          <div className="flex items-center space-x-1">
            <button
              className={`p-2 hover:bg-gray-100 rounded ${
                editor.isActive("link") ? "bg-gray-200" : ""
              }`}
              onClick={addLink}
            >
              <LinkIcon size={18} />
            </button>
            <div className="relative dropdown-container">
              <button
                className="p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsImageDropdownOpen(!isImageDropdownOpen)}
              >
                <ImageIcon size={18} />
              </button>
              {isImageDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                  <label className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Upload</span>
                  </label>

                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={async () => {
                      try {
                        const stream =
                          await navigator.mediaDevices.getUserMedia({
                            video: true,
                          });
                        const video = document.createElement("video");
                        const canvas = document.createElement("canvas");

                        // Create a modal for the camera view
                        const modal = document.createElement("div");
                        modal.style.position = "fixed";
                        modal.style.top = "0";
                        modal.style.left = "0";
                        modal.style.width = "100%";
                        modal.style.height = "100%";
                        modal.style.backgroundColor = "rgba(0,0,0,0.8)";
                        modal.style.zIndex = "1000";
                        modal.style.display = "flex";
                        modal.style.flexDirection = "column";
                        modal.style.alignItems = "center";
                        modal.style.justifyContent = "center";

                        video.srcObject = stream;
                        video.style.maxWidth = "100%";
                        video.style.maxHeight = "80vh";
                        video.autoplay = true;

                        const captureBtn = document.createElement("button");
                        captureBtn.textContent = "Capture";
                        captureBtn.style.margin = "20px";
                        captureBtn.style.padding = "10px 20px";
                        captureBtn.style.backgroundColor = "#4F46E5";
                        captureBtn.style.color = "white";
                        captureBtn.style.border = "none";
                        captureBtn.style.borderRadius = "5px";
                        captureBtn.style.cursor = "pointer";

                        modal.appendChild(video);
                        modal.appendChild(captureBtn);
                        document.body.appendChild(modal);

                        captureBtn.onclick = () => {
                          canvas.width = video.videoWidth;
                          canvas.height = video.videoHeight;
                          canvas.getContext("2d")?.drawImage(video, 0, 0);

                          // Convert to base64
                          const imageData = canvas.toDataURL("image/png");

                          // Insert image into editor
                          editor
                            .chain()
                            .focus()
                            .setImage({ src: imageData })
                            .run();

                          // Cleanup
                          stream.getTracks().forEach((track) => track.stop());
                          modal.remove();
                          setIsImageDropdownOpen(false);
                        };

                        // Add close button
                        const closeBtn = document.createElement("button");
                        closeBtn.textContent = "×";
                        closeBtn.style.position = "absolute";
                        closeBtn.style.top = "20px";
                        closeBtn.style.right = "20px";
                        closeBtn.style.fontSize = "24px";
                        closeBtn.style.color = "white";
                        closeBtn.style.backgroundColor = "transparent";
                        closeBtn.style.border = "none";
                        closeBtn.style.cursor = "pointer";

                        closeBtn.onclick = () => {
                          stream.getTracks().forEach((track) => track.stop());
                          modal.remove();
                          setIsImageDropdownOpen(false);
                        };

                        modal.appendChild(closeBtn);
                      } catch (err) {
                        console.error("Error accessing camera:", err);
                        alert(
                          "Could not access camera. Please make sure you have granted camera permissions."
                        );
                      }
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Camera</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => {
                      const modalBackdrop = document.createElement("div");
                      modalBackdrop.style.position = "fixed";
                      modalBackdrop.style.top = "0";
                      modalBackdrop.style.left = "0";
                      modalBackdrop.style.width = "100%";
                      modalBackdrop.style.height = "100%";
                      modalBackdrop.style.backgroundColor = "rgba(0,0,0,0.5)";
                      modalBackdrop.style.zIndex = "1000";
                      modalBackdrop.style.display = "flex";
                      modalBackdrop.style.alignItems = "center";
                      modalBackdrop.style.justifyContent = "center";
                      const modal = document.createElement("div");
                      modal.style.backgroundColor = "white";
                      modal.style.padding = "20px";
                      modal.style.borderRadius = "8px";
                      modal.style.width = "400px";
                      modal.style.maxWidth = "90%";
                      modal.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                      const title = document.createElement("h3");
                      title.textContent = "Insert Image URL";
                      title.style.marginBottom = "15px";
                      title.style.fontSize = "18px";
                      title.style.fontWeight = "bold";

                      const input = document.createElement("input");
                      input.type = "url";
                      input.placeholder = "Enter image URL";
                      input.style.width = "100%";
                      input.style.padding = "8px";
                      input.style.border = "1px solid #ddd";
                      input.style.borderRadius = "4px";
                      input.style.marginBottom = "15px";

                      const buttonContainer = document.createElement("div");
                      buttonContainer.style.display = "flex";
                      buttonContainer.style.justifyContent = "flex-end";
                      buttonContainer.style.gap = "10px";

                      const cancelBtn = document.createElement("button");
                      cancelBtn.textContent = "Cancel";
                      cancelBtn.style.padding = "8px 16px";
                      cancelBtn.style.border = "1px solid #ddd";
                      cancelBtn.style.borderRadius = "4px";
                      cancelBtn.style.backgroundColor = "white";
                      cancelBtn.style.cursor = "pointer";

                      const insertBtn = document.createElement("button");
                      insertBtn.textContent = "Insert";
                      insertBtn.style.padding = "8px 16px";
                      insertBtn.style.border = "none";
                      insertBtn.style.borderRadius = "4px";
                      insertBtn.style.backgroundColor = "#4F46E5";
                      insertBtn.style.color = "white";
                      insertBtn.style.cursor = "pointer";

                      cancelBtn.onclick = () => {
                        modalBackdrop.remove();
                        setIsImageDropdownOpen(false);
                      };

                      insertBtn.onclick = () => {
                        const url = input.value;
                        if (url) {
                          editor.chain().focus().setImage({ src: url }).run();
                        }
                        modalBackdrop.remove();
                        setIsImageDropdownOpen(false);
                      };

                      input.onkeydown = (e) => {
                        if (e.key === "Enter") {
                          insertBtn.click();
                        }
                      };

                      buttonContainer.appendChild(cancelBtn);
                      buttonContainer.appendChild(insertBtn);
                      modal.appendChild(title);
                      modal.appendChild(input);
                      modal.appendChild(buttonContainer);
                      modalBackdrop.appendChild(modal);
                      document.body.appendChild(modalBackdrop);

                      input.focus();
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span>By URL</span>
                  </button>

                  <div
                    className="w-full px-4 py-2 hover:bg-gray-100 border-t"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragDrop}
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-sm text-gray-500">
                      Drag & drop image here
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          {/* Text Alignment Dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 px-1 py-1 hover:bg-gray-100 rounded"
              onClick={() => {
                setIsAlignmentDropdownOpen(!isAlignmentDropdownOpen);
                setIsStyleDropdownOpen(false);
              }}
            >
              {editor.isActive({ textAlign: "center" }) && (
                <AlignCenter size={18} />
              )}
              {editor.isActive({ textAlign: "right" }) && (
                <AlignRight size={18} />
              )}
              {editor.isActive({ textAlign: "justify" }) && (
                <AlignJustify size={18} />
              )}
              {!editor.isActive({ textAlign: "center" }) &&
                !editor.isActive({ textAlign: "right" }) &&
                !editor.isActive({ textAlign: "justify" }) && (
                  <AlignLeft size={18} />
                )}
              <ChevronDown size={16} />
            </button>
            {isAlignmentDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                    editor.isActive({ textAlign: "left" }) ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("left").run();
                    setIsAlignmentDropdownOpen(false);
                  }}
                >
                  <AlignLeft size={18} />
                  <span>Align Left</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                    editor.isActive({ textAlign: "center" })
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("center").run();
                    setIsAlignmentDropdownOpen(false);
                  }}
                >
                  <AlignCenter size={18} />
                  <span>Align Center</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                    editor.isActive({ textAlign: "right" }) ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("right").run();
                    setIsAlignmentDropdownOpen(false);
                  }}
                >
                  <AlignRight size={18} />
                  <span>Align Right</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                    editor.isActive({ textAlign: "justify" })
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("justify").run();
                    setIsAlignmentDropdownOpen(false);
                  }}
                >
                  <AlignJustify size={18} />
                  <span>Justify</span>
                </button>
              </div>
            )}
          </div>

          {/* Lists Dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 py-1 hover:bg-gray-100 rounded"
              onClick={() => {
                setIsListDropdownOpen(!isListDropdownOpen);
                setIsStyleDropdownOpen(false);
                setIsAlignmentDropdownOpen(false);
              }}
            >
              {editor.isActive("bulletList") && (
                <List size={18} className="text-black" />
              )}
              {editor.isActive("orderedList") && (
                <ListOrdered size={18} className="text-black" />
              )}
              {!editor.isActive("bulletList") &&
                !editor.isActive("orderedList") && (
                  <List size={18} className="text-black" />
                )}

              <ChevronDown size={16} />
            </button>
            {isListDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                    editor.isActive("bulletList") ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                    setIsListDropdownOpen(false);
                  }}
                >
                  <List size={18} className="text-black" />
                  <span>Bullet List</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                    editor.isActive("orderedList") ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                    setIsListDropdownOpen(false);
                  }}
                >
                  <ListOrdered size={18} className="text-black" />
                  <span>Numbered List</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                    editor.isActive("taskList") ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    editor.chain().focus().toggleTaskList().run();
                    setIsListDropdownOpen(false);
                  }}
                >
                  <CheckSquare size={18} className="text-black" />
                  <span>Task List</span>
                </button>
              </div>
            )}
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 py-1 hover:bg-gray-100 rounded"
              onClick={() => {
                setIsTextColorDropdownOpen(!isTextColorDropdownOpen);
                setIsBackgroundColorDropdownOpen(false);
                setIsStyleDropdownOpen(false);
                setIsAlignmentDropdownOpen(false);
                setIsListDropdownOpen(false);
              }}
            >
              <Type size={18} />
              <ChevronDown size={16} />
            </button>
            {isTextColorDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                {colors.map((color) => (
                  <button
                    key={color.color}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setTextColor(color.color)}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.color }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Background Color Dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 px-1 py-1 hover:bg-gray-100 rounded"
              onClick={() => {
                setIsBackgroundColorDropdownOpen(
                  !isBackgroundColorDropdownOpen
                );
                setIsTextColorDropdownOpen(false);
                setIsStyleDropdownOpen(false);
                setIsAlignmentDropdownOpen(false);
                setIsListDropdownOpen(false);
              }}
            >
              <Palette size={18} />
              <ChevronDown size={16} />
            </button>
            {isBackgroundColorDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                {backgroundColors.map((color) => (
                  <button
                    key={color.color}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setBackgroundColor(color.color)}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.color }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* AI Button */}
          <button className="bg-purple-600 text-white text-sm rounded-full px-3 py-2 flex items-center space-x-2 hover:bg-purple-700">
            <Rocket size={16} />
            <span>Write with AI</span>
          </button>
        </div>

        <div className="p-4">
          <EditorContent
            editor={editor}
            className="prose max-w-none [&]:outline-none [&_*]:outline-none focus:outline-none focus-visible:outline-none [&_*]:focus-visible:outline-none [&_ul]:text-black [&_ol]:text-black [&_ul>li::marker]:text-black [&_ol>li::marker]:text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
