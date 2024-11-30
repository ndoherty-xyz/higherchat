export const HigherLogo = (props: {
  size: number;
  color: string;
  className?: string;
}) => {
  const aspectRatio = 0.9390243902;
  const height = props.size;
  const width = props.size * aspectRatio;

  return (
    <svg
      width={width}
      height={height}
      className={props.className}
      viewBox="0 0 462 492"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M230.181 0.650024L0.804993 229.616L69.413 297.405L181.643 184.765L181.718 491.76H281.176V184.765L394.021 297.405L461.195 229.616L232.229 0.650024H230.181Z"
        fill={props.color}
      />
    </svg>
  );
};
