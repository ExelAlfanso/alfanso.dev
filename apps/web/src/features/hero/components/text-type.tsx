"use client";

import { gsap } from "gsap";
import { createElement, type ElementType, useEffect, useRef } from "react";
import useTextType from "../hooks/use-text-type";

interface TextTypeProps {
  as?: ElementType;
  className?: string;
  cursorBlinkDuration?: number;
  cursorCharacter?: string | React.ReactNode;
  cursorClassName?: string;
  deletingSpeed?: number;
  hideCursorWhileTyping?: boolean;
  initialDelay?: number;
  loop?: boolean;
  onSentenceComplete?: (sentence: string, index: number) => void;
  pauseDuration?: number;
  reverseMode?: boolean;
  showCursor?: boolean;
  startOnVisible?: boolean;
  text: string | string[];
  textColors?: string[];
  typingSpeed?: number;
  variableSpeed?: { min: number; max: number };
}

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const {
    displayedText,
    currentCharIndex,
    isDeleting,
    currentTextIndex,
    containerRef,
  } = useTextType({
    deletingSpeed,
    initialDelay,
    loop,
    onSentenceComplete,
    pauseDuration,
    reverseMode,
    startOnVisible,
    text,
    typingSpeed,
    variableSpeed,
  });

  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!(showCursor && cursorRef.current)) {
      return;
    }

    gsap.set(cursorRef.current, { opacity: 1 });

    const animation = gsap.to(cursorRef.current, {
      duration: cursorBlinkDuration,
      ease: "power2.inOut",
      opacity: 0,
      repeat: -1,
      yoyo: true,
    });

    return () => {
      animation.kill();
    };
  }, [showCursor, cursorBlinkDuration]);

  const textArray = Array.isArray(text) ? text : [text];
  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    {
      className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
      ref: containerRef,
      ...props,
    },
    <span className="inline">{displayedText}</span>,
    showCursor && (
      <span
        className={`ml-1 inline-block opacity-100 ${
          shouldHideCursor ? "hidden" : ""
        } ${cursorClassName}`}
        ref={cursorRef}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;
