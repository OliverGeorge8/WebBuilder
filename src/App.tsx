import "./App.css";
import Builder from "./main/Builder";
import Canvas from "./main/Canvas";
import Block from "./components/Block";

function App() {
  return (
    <div className="App">
      <Builder>
        <div className="grid grid-cols-2 min-h-screen">
          <Canvas />

          <div className="space-y-8">
            <Block
              title="Text"
              type="text"
              render={(opts) => {
                return <h1>hello</h1>;
              }}
            />
            <Block
              title="Image"
              type="image"
              render={(opts) => {
                return <div className="w-5 h-5 bg-slate-700"></div>;
              }}
            />
          </div>
        </div>
      </Builder>
    </div>
  );
}

export default App;
