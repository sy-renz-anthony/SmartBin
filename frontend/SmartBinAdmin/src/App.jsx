import MovieCard from "./components/MovieCard"

function App() {

  const movieNumber = 2;

  return (
    <div class="text-3xl font-bold underline">
      {
        movieNumber === 1 ?(<MovieCard movie={{title: "Tim's film", release_date: "2024"}}/>):
        (<MovieCard movie={{title: "Joe's film", release_date: "2020"}}/>)
      }
      
    </div>
  )
}

export default App
