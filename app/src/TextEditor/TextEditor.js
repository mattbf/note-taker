import React, { useState, useCallback, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import {
  Node,
  Editor,
  Transforms,
  Range,
  Point,
  createEditor,
  Text,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'

//CUSTOM ELEMENTS
import {
  CodeBlock,
  BlockQuote,
  BulletedList,
  NumberedList,
  HeadingOne,
  HeadingTwo,
  HeadingThree,

} from './CustomElements/CustomElements.js'

import { Leaf } from './CustomLeaves/CustomLeaves.js'

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

const MARKDOWNSHORTCUTS = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: 'heading-two',
    children: [{ text: 'Try it out!' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
]

const TextEditor = () => {
  //const [value, setValue] = useState(initialValue || [])

  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem('content')) || initialValue
  )

  const editor = useMemo(
    () => withReact(withHistory(createEditor())),
    []
  )
  //withMarkdownShortcuts(withReact(withHistory(createEditor()))),

  //FOR RENDERING CUSTOM BLOCKS
  const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
  }
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeBlock {...props} />
      case 'block-quote':
        return <BlockQuote {...props}/>
      case 'bulleted-list':
        return <BulletedList {...props}/>
        case 'list-item':
          return <NumberedList {...props}/>
      case 'heading-one':
        return <HeadingOne {...props}/>
      case 'heading-two':
        return <HeadingTwo {...props}/>
      case 'heading-three':
        return <HeadingThree {...props}/>

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
          event.preventDefault()

          let commandKey = event.ctrlKey || event.metaKey ? true : false
          console.log(commandKey + " pressed " + event.key)
          // if (!commandKey) {
          //   return
          // }

          // Replace the `onKeyDown` logic with our new commands.
          if(commandKey){
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
          }

        }}
      />
    </Slate>
  )
}

const withMarkdownShortcuts = editor => {
  const { deleteBackward, insertText } = editor

  editor.insertText = text => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range)
      const type = MARKDOWNSHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)
        Transforms.delete(editor)
        const newProperties: Partial<SlateElement> = {
          type,
        }
        Transforms.setNodes(editor, newProperties, {
          match: n => Editor.isBlock(editor, n),
        })

        if (type === 'list-item') {
          const list = { type: 'bulleted-list', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'list-item',
          })
        }

        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          }
          Transforms.setNodes(editor, newProperties)

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'bulleted-list',
              split: true,
            })
          }

          return
        }
      }

      deleteBackward(...args)
    }
  }

  return editor
}

export default TextEditor
