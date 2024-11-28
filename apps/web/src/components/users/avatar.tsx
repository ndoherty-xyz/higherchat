import Image from "next/image";

export const Avatar = (props: {
  pfpUrl?: string;
  size: "sm" | "md" | "lg" | "xl" | "2xl";
  overrideSize?: number;
  noBorder?: boolean;
  className?: string;
}) => {
  const pixelSize = props.overrideSize
    ? props.overrideSize
    : props.size === "2xl"
    ? 120
    : props.size === "xl"
    ? 80
    : props.size === "lg"
    ? 40
    : props.size === "md"
    ? 24
    : 16;

  const borderSize =
    props.size === "2xl"
      ? 3
      : props.size === "xl"
      ? 2
      : props.size === "lg"
      ? 2
      : props.size === "md"
      ? 1
      : 1;

  if (props.pfpUrl) {
    return (
      <div
        style={{
          width: pixelSize,
          height: pixelSize,
          borderRadius: 999,
          position: "relative",
        }}
        className={props.className}
      >
        <Image
          unoptimized
          alt="pfp"
          style={{
            borderRadius: 999,
            ...(props.noBorder
              ? {}
              : {
                  outline: `${borderSize}px solid #00000014`,
                  outlineOffset: -borderSize,
                }),
          }}
          objectFit="cover"
          objectPosition="center"
          src={props.pfpUrl}
          fill
        />
      </div>
    );
  } else {
    return (
      <div
        className={`bg-gray-500 ${props.className}`}
        style={{
          width: pixelSize,
          height: pixelSize,
          borderWidth: 1,
          borderRadius: 999,
          borderColor: "#000000a",
        }}
      />
    );
  }
};
