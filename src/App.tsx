import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Experiments from '@/pages/Experiments';
import Explore from '@/pages/Explore';
import Challenges from '@/pages/Challenges';
import Discover from '@/pages/Discover';
import MathMap from '@/pages/MathMap';
import ExhibitionMode from '@/pages/ExhibitionMode';
import About from '@/pages/About';
import Settings from '@/pages/Settings';
import Learn from '@/pages/Learn';
import FormulaLab from '@/pages/FormulaLab';
import MathMinds from '@/pages/MathMinds';
import Playground from '@/pages/Playground';
import MathWorld from '@/pages/MathWorld';
import DailyDiscovery from '@/pages/DailyDiscovery';
import SearchPage from '@/pages/SearchPage';
import FunFacts from '@/pages/FunFacts';
import ProbabilityLab from '@/experiments/ProbabilityLab';
import StatisticsLab from '@/experiments/StatisticsLab';
import FunctionExplorer from '@/experiments/FunctionExplorer';
import GeometryLab from '@/experiments/GeometryLab';
import FractalLab from '@/experiments/FractalLab';
import OtherLabs from '@/experiments/OtherLabs';
import BirthdayProblem from '@/experiments/BirthdayProblem';
import MontyHall from '@/experiments/MontyHall';
import RandomWalk from '@/experiments/RandomWalk';
import PythagoreanLab from '@/experiments/PythagoreanLab';
import TowerOfHanoi from '@/pages/playground/TowerOfHanoi';
import MagicSquares from '@/pages/playground/MagicSquares';
import Nim from '@/pages/playground/Nim';
import FifteenPuzzle from '@/pages/playground/FifteenPuzzle';
import RubiksCube from '@/pages/playground/RubiksCube';
import Tangram from '@/pages/playground/Tangram';
import Pentominoes from '@/pages/playground/Pentominoes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/experiments/probability-lab" element={<ProbabilityLab />} />
        <Route path="/experiments/statistics-lab" element={<StatisticsLab />} />
        <Route path="/experiments/function-explorer" element={<FunctionExplorer />} />
        <Route path="/experiments/geometry-lab" element={<GeometryLab />} />
        <Route path="/experiments/fractal-lab" element={<FractalLab />} />
        <Route path="/experiments/coordinate-geometry" element={<OtherLabs kind="coordinate-geometry" />} />
        <Route path="/experiments/sequences-lab" element={<OtherLabs kind="sequences-lab" />} />
        <Route path="/experiments/prime-explorer" element={<OtherLabs kind="prime-explorer" />} />
        <Route path="/experiments/optimization-lab" element={<OtherLabs kind="optimization-lab" />} />
        <Route path="/experiments/birthday-problem" element={<BirthdayProblem />} />
        <Route path="/experiments/monty-hall" element={<MontyHall />} />
        <Route path="/experiments/random-walk" element={<RandomWalk />} />
        <Route path="/experiments/pythagorean-lab" element={<PythagoreanLab />} />
        <Route path="/formula-lab" element={<FormulaLab />} />
        <Route path="/math-minds" element={<MathMinds />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/playground/tower-of-hanoi" element={<TowerOfHanoi />} />
        <Route path="/playground/magic-squares" element={<MagicSquares />} />
        <Route path="/playground/nim" element={<Nim />} />
        <Route path="/playground/15-puzzle" element={<FifteenPuzzle />} />
        <Route path="/playground/rubiks-cube" element={<RubiksCube />} />
        <Route path="/playground/tangram" element={<Tangram />} />
        <Route path="/playground/pentominoes" element={<Pentominoes />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/math-world" element={<MathWorld />} />
        <Route path="/map" element={<MathMap />} />
        <Route path="/exhibition" element={<ExhibitionMode />} />
        <Route path="/daily" element={<DailyDiscovery />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/fun-facts" element={<FunFacts />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
