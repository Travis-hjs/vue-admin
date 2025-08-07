/**
 * 表格标题
 * @param props
 */
export function TableTitle(props: { text: string }) {
  const title = props.text;
  const list = title.split("\\n");
  if (list.length > 1) {
    return (
      <>
        {list.map(el => (
          <p>{el}</p>
        ))}
      </>
    );
  }
  return <>{title}</>;
}
