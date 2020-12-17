// Import React dependencies.
import React, { useEffect, useMemo, useState, useCallback } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'
import { Editor, Transforms } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

//CUSTOM ELEMENTS
import CodeBlock from './CustomElements/CodeBlock.js'

const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  useEffect(() => {
    if (!value) {
       //Transforms.deselect(editor);
       // or set selection to neutral state:
       editor.selection = { anchor: { path: [0,0], offset:0 }, focus: { path: [0,0], offset: 0 } }
       // Transforms.select(editor, {
       //   anchor: { path: [0, 0], offset: 0 },
       //   focus: { path: [0, 0], offset: 0 },
       // })

    }
  }, [value]);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeBlock {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    >
    <Editable
      renderElement={renderElement}

      onKeyDown={event => {
        //transform text
        if (event.key === '&') {
          event.preventDefault()
          editor.insertText('and')
        }
        //transfrom node block into code block
        if (event.key === '`' && event.ctrlKey) {
          // Prevent the "`" from being inserted by default.
          event.preventDefault()
          // Determine whether any of the currently selected blocks are code blocks.
            const [match] = Editor.nodes(editor, {
              match: n => n.type === 'code',
            })
            // Toggle the block type depending on whether there's already a match.
            Transforms.setNodes(
              editor,
              { type: match ? 'paragraph' : 'code' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }
      }}
    />
    </Slate>
  )
}

export default TextEditor
