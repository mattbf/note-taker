export const CodeBlock = props => {
  return (
    <pre {...props.attributes}>
      <code style={{backgroundColor: '#CCC', padding: 8, width: '100%', minWidth: '100%'}}>{props.children}</code>
    </pre>
  )
}

export default CodeBlock
