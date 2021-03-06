

import TextEditor from './TextEditor/TextEditor.js'


function App() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
      <div style={{border: '1px solid rgba(196, 196, 196, 0.5)', minHeight: 400, minWidth: 400, width: '90%', maxWidth: 1000, margin: 20, padding: 10}}>
        <TextEditor />
      </div>
    </div>
  );
}

export default App;
