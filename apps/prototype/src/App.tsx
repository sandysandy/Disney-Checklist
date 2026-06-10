import { Route, Routes } from 'react-router-dom';
import { JourneyProvider } from './journey/JourneyContext';
import { Layout } from './Layout';
import { CheckAnswers } from './pages/CheckAnswers';
import { Confirmation } from './pages/Confirmation';
import { NotFound, ServerError, Unavailable } from './pages/errors';
import { FullName, JugglingBalls, JugglingTrick, WhereDoYouLive } from './pages/questions';
import { Start } from './pages/Start';

export default function App() {
  return (
    <JourneyProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Start />} />
          <Route path="/full-name" element={<FullName />} />
          <Route path="/where-do-you-live" element={<WhereDoYouLive />} />
          <Route path="/juggling-balls" element={<JugglingBalls />} />
          <Route path="/juggling-trick" element={<JugglingTrick />} />
          <Route path="/check-answers" element={<CheckAnswers />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {/* Demo routes for the standard error pages */}
          <Route path="/500" element={<ServerError />} />
          <Route path="/unavailable" element={<Unavailable />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </JourneyProvider>
  );
}
