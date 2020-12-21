// Import React dependencies.
import React, { useEffect, useMemo, useState, useCallback } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'
import { Editor, Transforms, Text } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

//CUSTOM ELEMENTS
import { CodeBlock } from './CustomElements/CustomElements.js'
import { Leaf } from './CustomLeaves/CustomLeaves.js'

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

  //FOR RENDERING CUSTOM BLOCKS
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeBlock {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  //FOR RENDERING CUSTOM LEAVES
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}

      style={{border: 'solid', width: '100%', height: '100%'}}
    >
    <Editable
      renderElement={renderElement}
      renderLeaf={renderLeaf}

      onKeyDown={event => {
          let commandKey = event.ctrlKey || event.metaKey ? true : false
          if (!commandKey) {
            return
          } else {
            console.log("command issued " + event.key)
            switch (event.key) {
              // When "`" is pressed, keep our existing code block logic.
              case '`': {
                event.preventDefault()
                const [match] = Editor.nodes(editor, {
                  match: n => n.type === 'code',
                })
                Transforms.setNodes(
                  editor,
                  { type: match ? 'paragraph' : 'code' },
                  { match: n => Editor.isBlock(editor, n) }
                )
                break
              }

              // When "B" is pressed, bold the text in the selection.
              case 'b': {
                console.log("b pressed")
                // Apply it to text nodes, and split the text node up if the
                // selection is overlapping only part of it.
                event.preventDefault()
                Transforms.setNodes(
                  editor,
                  { bold: !editor.bold },
                  { match: n => Text.isText(n), split: true }
                )
                break
              }
            }
          }
        }}

    />
    </Slate>
  )
}

export default TextEditor
