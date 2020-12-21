const CodeBlock = props => {
  return (
    <pre {...props.attributes}>
      <code style={{backgroundColor: '#CCC', padding: 8, width: '100%', minWidth: '100%'}}>{props.children}</code>
    </pre>
  )
}

const BlockQuote = props => {
  return (
    <blockquote {...props.attributes}>{props.children}</blockquote>
  )
}

const BulletedList = props => {
  return (
    <ul {...props.attributes}>{props.children}</ul>
  )
}

const NumberedList = props => {
  return (
    <li {...props.attributes}>{props.children}</li>
  )
}
const HeadingOne = props => {
  return (
    <h1 {...props.attributes}>{props.children}</h1>
  )
}
const HeadingTwo = props => {
  return (
    <h2 {...props.attributes}>{props.children}</h2>
  )
}
const HeadingThree = props => {
  return (
    <h3 {...props.attributes}>{props.children}</h3>
  )
}


export {
  CodeBlock,
  BlockQuote,
  BulletedList,
  NumberedList,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
}
