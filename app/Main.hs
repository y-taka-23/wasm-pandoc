module Main where

import           Asterius.Text  ( textFromJSString, textToJSString )
import           Asterius.Types ( JSString(..), fromJSString )
import           Data.Maybe     ( fromMaybe )
import qualified Data.Text      as T
import           Text.Pandoc
    ( Pandoc
    , PandocMonad
    , ReaderOptions
    , WriterOptions
    , def
    , readHtml
    , readLaTeX
    , readMarkdown
    , runPure
    , writeHtml5String
    , writeLaTeX
    , writeMarkdown
    )

main :: IO ()
main = error "built with --no-main"

convertFromTo :: String -> String -> T.Text -> Maybe T.Text
convertFromTo from to input =
    case runPure $ (readerOf from) def input of
        Left _    -> Nothing
        Right doc -> case runPure $ (writerOf to) def doc of
            Left _       -> Nothing
            Right output -> Just output

type PandocReader m = ReaderOptions -> T.Text -> m Pandoc

readerOf :: PandocMonad m => String -> PandocReader m
readerOf "markdown" = readMarkdown
readerOf "html"     = readHtml
readerOf "latex"    = readLaTeX
readerOf _          = readMarkdown

type PandocWriter m = WriterOptions -> Pandoc -> m T.Text

writerOf :: PandocMonad m => String -> PandocWriter m
writerOf "markdown" = writeMarkdown
writerOf "html"     = writeHtml5String
writerOf "latex"    = writeLaTeX
writerOf _          = writeMarkdown

convert :: JSString -> JSString -> JSString -> JSString
convert from to =
      textToJSString
    . fromMaybe (T.pack "")
    . convertFromTo (fromJSString from) (fromJSString to)
    . textFromJSString

foreign export javascript "convert" convert :: JSString -> JSString -> JSString -> JSString
