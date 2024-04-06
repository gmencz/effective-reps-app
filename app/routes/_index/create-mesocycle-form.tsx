export function CreateMesocycleForm() {
  return (
    <form method="post" action="/?index">
      <label htmlFor="mesocycleName">Mesocycle name</label>
      <input type="text" id="mesocycleName" name="mesocycleName" />
      <button type="submit">Create mesocycle</button>
    </form>
  );
}
