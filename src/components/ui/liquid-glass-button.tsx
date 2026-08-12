"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva("inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-emerald-400 text-emerald-950 hover:bg-emerald-300",outline:"border border-white/20 bg-transparent hover:bg-white/10",ghost:"hover:bg-white/10",link:"underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 px-3 text-xs",lg:"h-10 px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}})
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof buttonVariants>{asChild?:boolean}
const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,asChild=false,...props},ref)=>{const Comp=asChild?Slot:"button";return <Comp className={cn(buttonVariants({variant,size,className}))} ref={ref} {...props}/>})
Button.displayName="Button"

const liquidbuttonVariants=cva("inline-flex items-center justify-center cursor-pointer gap-3 whitespace-nowrap rounded-full text-sm font-medium disabled:pointer-events-none disabled:opacity-50 outline-none transition duration-300 hover:scale-105 active:scale-95",{variants:{variant:{default:"bg-transparent text-white",ghost:"bg-transparent text-white",dark:"bg-transparent text-emerald-950"},size:{default:"h-11 px-6",lg:"h-12 px-8",xl:"h-14 px-10",icon:"size-11"}},defaultVariants:{variant:"default",size:"xl"}})

function GlassFilter(){return <svg className="hidden"><defs><filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence"/><feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise"/><feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced"/><feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur"/><feComposite in="finalBlur" in2="finalBlur" operator="over"/></filter></defs></svg>}

function LiquidButton({className,variant,size,asChild=false,children,...props}:React.ComponentProps<"button">&VariantProps<typeof liquidbuttonVariants>&{asChild?:boolean}){const Comp=asChild?Slot:"button";return <Comp data-slot="button" className={cn("relative isolate",liquidbuttonVariants({variant,size,className}))} {...props}><span className="absolute inset-0 -z-10 rounded-full border border-white/25 bg-white/10 shadow-[inset_1px_1px_1px_rgba(255,255,255,.45),inset_-1px_-1px_1px_rgba(0,0,0,.2),0_8px_30px_rgba(0,0,0,.18)] backdrop-blur-xl"/><span className="absolute inset-[1px] -z-10 overflow-hidden rounded-full" style={{backdropFilter:'url("#container-glass")'}}/><span className="pointer-events-none z-10 flex items-center gap-3">{children}</span><GlassFilter/></Comp>}

type ColorVariant="default"|"success"|"gold"|"bronze"
interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{variant?:ColorVariant}
const metals:Record<ColorVariant,string>={default:"from-zinc-200 via-zinc-500 to-zinc-300",success:"from-emerald-200 via-emerald-700 to-emerald-300",gold:"from-amber-200 via-amber-600 to-yellow-200",bronze:"from-orange-200 via-amber-800 to-orange-300"}
const MetalButton=React.forwardRef<HTMLButtonElement,MetalButtonProps>(({children,className,variant="default",...props},ref)=><span className={cn("inline-flex rounded-lg bg-gradient-to-b p-px shadow-lg",metals[variant])}><button ref={ref} className={cn("h-11 rounded-[7px] bg-gradient-to-b from-white/30 to-black/25 px-6 text-sm font-semibold text-white active:translate-y-px",className)} {...props}>{children}</button></span>)
MetalButton.displayName="MetalButton"
export {Button,buttonVariants,LiquidButton,liquidbuttonVariants,MetalButton}
