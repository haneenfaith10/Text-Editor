import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Scissors, ChevronDown, Bold, Italic, Underline, Link, Image, AlignLeft, Plus } from 'lucide-react';

interface EditorState {
  content: string;
  heading: string;
}

const TextEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    content: `The city, a kaleidoscope of digital billboards and holographic projections, is in a state of perpetual twilight, casting an ethereal glow on its inhabitants.

X_AE_B-22's mission is to locate the source of a mysterious signal that has been disrupting the neural networks of both humans and synthetics alike. This signal, rumored to be the work of a rogue faction known as the Shadow Code, has the potential to rewrite the very fabric of consciousness.

X_AE_B-22's pursuit leads it to the subterranean depths of the city, where forgotten tunnels and abandoned cyber-labs hide secrets long buried by time. Each step forward unravels more of the intricate web spun by the Shadow Code, revealing a plot to seize control of the entire megacity.

Amidst the neon-lit chaos, X_AE_B-22 encounters a diverse cast of allies and adversaries, each with their own agendas and secrets. There is Luna, a rebellious hacker with a vendetta against the megacorporations, and Kyro, a seasoned detective with a cybernetic arm who has seen too much in his lifetime.

Together, they form an unlikely alliance, driven by a shared goal to prevent the collapse of their world. As X_AE_B-22 delves deeper`,
    heading: 'Chapter 1, The History'
  });

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 mb-4 border-b pb-2">
        <button className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <RotateCcw size={20} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button className="p-2 hover:bg-gray-100 rounded">
          <Scissors size={20} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded">
          <span>Paragraph text</span>
          <ChevronDown size={16} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button className="p-2 hover:bg-gray-100 rounded">
          <Bold size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Italic size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Underline size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Link size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Image size={20} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button className="p-2 hover:bg-gray-100 rounded">
          <AlignLeft size={20} />
        </button>
        <div className="flex-grow" />
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center space-x-2 hover:bg-purple-700">
          <Plus size={16} />
          <span>Write with AI</span>
        </button>
      </div>

      {/* Editor Content */}
      <div className="prose max-w-none">
        <h1 className="text-2xl font-bold mb-4">{editorState.heading}</h1>
        <div 
          className="focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setEditorState(prev => ({
            ...prev,
            content: e.currentTarget.textContent || ''
          }))}
          dangerouslySetInnerHTML={{ __html: editorState.content.replace(/\n/g, '<br>') }}
        />
      </div>
    </div>
  );
};

export default TextEditor;