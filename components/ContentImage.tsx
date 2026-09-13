"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

import { contentUrl } from "@/lib/contentUrl";

/**
 * next/image for artwork served out of public/ (light pages, icons).
 *
 * On the web contentUrl() returns the path unchanged, so this behaves exactly like
 * a plain next/image. In the native app it loads from the live origin first, so
 * artwork for content published after the last store build appears straight away,
 * and falls back to the bundled copy at the same relative path if that request
 * fails — without the fallback, pointing at the live origin would have traded new
 * content for broken images with no signal.
 */
export default function ContentImage({ src, onError, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  const [resolved, setResolved] = useState(() => contentUrl(src));

  useEffect(() => {
    setResolved(contentUrl(src));
  }, [src]);

  return (
    <Image
      {...rest}
      src={resolved}
      // Only when rewritten to the live origin (native): the optimizer is for
      // same-origin assets, and the native export is unoptimized globally anyway.
      // On the web resolved === src, so this stays false and nothing changes.
      unoptimized={resolved !== src}
      onError={(e) => {
        if (resolved !== src) setResolved(src);
        onError?.(e);
      }}
    />
  );
}
