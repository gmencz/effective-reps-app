export function CreateExerciseForm() {
  return (
    <form method="post" action="/exercises?index">
      <label htmlFor="exerciseName">Exercise name</label>
      <input type="text" id="exerciseName" name="exerciseName" />
      <button type="submit">Create exercise</button>
    </form>
  );
}
