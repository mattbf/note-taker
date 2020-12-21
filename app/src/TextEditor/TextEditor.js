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

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })

    return !!match
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    )
  },
}



const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem('content')) || [
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
      },
    ]
  )

  //FOR RENDERING CUSTOM BLOCKS
  const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
  }
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeBlock {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value)

        // Save the value to Local Storage.
        const content = JSON.stringify(value)
        localStorage.setItem('content', content)
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          console.log(event)
          let commandKey = event.ctrlKey || event.metaKey ? true : false
          console.log(commandKey + " pressed " + event.key)
          if (!commandKey) {
            return
          }

          // Replace the `onKeyDown` logic with our new commands.
          switch (event.key) {
            case '`': {
              event.preventDefault()
              CustomEditor.toggleCodeBlock(editor)
              break
            }

            case 'b': {
              event.preventDefault()
              CustomEditor.toggleBoldMark(editor)
              break
            }
          }
        }}
      />
    </Slate>
  )
}

//
// // Define our own custom set of helpers.
// const CustomEditor = {
//   isBoldMarkActive(editor) {
//     const [match] = Editor.nodes(editor, {
//       match: n => n.bold === true,
//       universal: true,
//     })
//
//     return !!match
//   },
//
//   isCodeBlockActive(editor) {
//     const [match] = Editor.nodes(editor, {
//       match: n => n.type === 'code',
//     })
//
//     return !!match
//   },
//
//   toggleBoldMark(editor) {
//     const isActive = CustomEditor.isBoldMarkActive(editor)
//     Transforms.setNodes(
//       editor,
//       { bold: isActive ? null : true },
//       { match: n => Text.isText(n), split: true }
//     )
//   },
//
//   toggleCodeBlock(editor) {
//     const isActive = CustomEditor.isCodeBlockActive(editor)
//     Transforms.setNodes(
//       editor,
//       { type: isActive ? null : 'code' },
//       { match: n => Editor.isBlock(editor, n) }
//     )
//   },
// }
//
//
// const TextEditor = () => {
//   const editor = useMemo(() => withReact(createEditor()), [])
//   // Add the initial value when setting up our state.
//   const [value, setValue] = useState([
//     {
//       type: 'paragraph',
//       children: [{ text: 'A line of text in a paragraph.' }],
//     },
//   ])
//
//   useEffect(() => {
//     if (!value) {
//        //Transforms.deselect(editor);
//        // or set selection to neutral state:
//        editor.selection = { anchor: { path: [0,0], offset:0 }, focus: { path: [0,0], offset: 0 } }
//        // Transforms.select(editor, {
//        //   anchor: { path: [0, 0], offset: 0 },
//        //   focus: { path: [0, 0], offset: 0 },
//        // })
//
//     }
//   }, [value]);
//
  // //FOR RENDERING CUSTOM BLOCKS
  // const renderElement = useCallback(props => {
  //   switch (props.element.type) {
  //     case 'code':
  //       return <CodeBlock {...props} />
  //     default:
  //       return <DefaultElement {...props} />
  //   }
  // }, [])
//
//   //FOR RENDERING CUSTOM LEAVES
//   const renderLeaf = useCallback(props => {
//     return <Leaf {...props} />
//   }, [])
//
//   const DefaultElement = props => {
//     return <p {...props.attributes}>{props.children}</p>
//   }
//
//   return (
//     <Slate
//       editor={editor}
//       value={value}
//       onChange={newValue => setValue(newValue)}
//
//       style={{border: 'solid', width: '100%', height: '100%'}}
//     >
//     <Editable
//       renderElement={renderElement}
//       renderLeaf={renderLeaf}
//
//       onKeyDown={event => {
//           let commandKey = event.ctrlKey || event.metaKey ? true : false
//           if (!commandKey) {
//             return
//           } else {
//             console.log("command issued " + event.key)
//             switch (event.key) {
//               case '`': {
//                 event.preventDefault()
//                 CustomEditor.toggleCodeBlock(editor)
//                 break
//               }
//
//               case 'b': {
//                 event.preventDefault()
//                 CustomEditor.toggleBoldMark(editor)
//                 break
//               }
//             }
//           }
//         }}
//
//     />
//     </Slate>
//   )
// }

export default TextEditor
