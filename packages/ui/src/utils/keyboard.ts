// https://www.w3.org/TR/uievents-key/#named-key-attribute-value

type SpecialKey = 'Unidentified';

type ModifierKey =
  | 'Alt'
  | 'AltGraph'
  | 'CapsLock'
  | 'Control'
  | 'Fn'
  | 'FnLock'
  | 'Meta'
  | 'NumLock'
  | 'ScrollLock'
  | 'Shift'
  | 'Symbol'
  | 'SymbolLock'
  | 'Hyper'
  | 'Super';

type WhitespaceKey = 'Enter' | 'Tab' | ' ';

type NavigationKey =
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'End'
  | 'Home'
  | 'PageDown'
  | 'PageUp';

type EditingKey =
  | 'Backspace'
  | 'Clear'
  | 'Copy'
  | 'CrSel'
  | 'Cut'
  | 'Delete'
  | 'EraseEof'
  | 'ExSel'
  | 'Insert'
  | 'Paste'
  | 'Redo'
  | 'Undo';

type UIKey =
  | 'Accept'
  | 'Again'
  | 'Attn'
  | 'Cancel'
  | 'ContextMenu'
  | 'Escape'
  | 'Execute'
  | 'Find'
  | 'Help'
  | 'Pause'
  | 'Play'
  | 'Props'
  | 'Select'
  | 'ZoomIn'
  | 'ZoomOut';

type DeviceKey =
  | 'BrightnessDown'
  | 'BrightnessUp'
  | 'Eject'
  | 'LogOff'
  | 'Power'
  | 'PowerOff'
  | 'PrintScreen'
  | 'Hibernate'
  | 'Standby'
  | 'WakeUp';

type IMEKey =
  | 'AllCandidates'
  | 'Alphanumeric'
  | 'CodeInput'
  | 'Compose'
  | 'Convert'
  | 'Dead'
  | 'FinalMode'
  | 'GroupFirst'
  | 'GroupLast'
  | 'GroupNext'
  | 'GroupPrevious'
  | 'ModeChange'
  | 'NextCandidate'
  | 'NonConvert'
  | 'PreviousCandidate'
  | 'Process'
  | 'SingleCandidate'
  | 'HangulMode'
  | 'HanjaMode'
  | 'JunjaMode'
  | 'Eisu'
  | 'Hankaku'
  | 'Hiragana'
  | 'HiraganaKatakana'
  | 'KanaMode'
  | 'KanjiMode'
  | 'Katakana'
  | 'Romaji'
  | 'Zenkaku'
  | 'ZenkakuHankaku';

type DigitNonZero = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Digit = 0 | DigitNonZero;

type LowercaseLetter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

type LetterKey = LowercaseLetter | Uppercase<LowercaseLetter>;

type DigitKey = `${Digit}`;

type PunctuationKey =
  | '`'
  | '~'
  | '!'
  | '@'
  | '#'
  | '$'
  | '%'
  | '^'
  | '&'
  | '*'
  | '('
  | ')'
  | '-'
  | '_'
  | '='
  | '+'
  | '['
  | ']'
  | '{'
  | '}'
  | '\\'
  | '|'
  | ';'
  | ':'
  | "'"
  | '"'
  | ','
  | '<'
  | '.'
  | '>'
  | '/'
  | '?';

type FunctionKey =
  | `F${DigitNonZero}`
  | `F1${Digit}`
  | `F2${0 | 1 | 2 | 3 | 4}`
  | `Soft${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

type MultimediaKey =
  | 'ChannelDown'
  | 'ChannelUp'
  | 'Close'
  | 'MailForward'
  | 'MailReply'
  | 'MailSend'
  | 'MediaClose'
  | 'MediaFastForward'
  | 'MediaPause'
  | 'MediaPlay'
  | 'MediaPlayPause'
  | 'MediaRecord'
  | 'MediaRewind'
  | 'MediaStop'
  | 'MediaTrackNext'
  | 'MediaTrackPrevious'
  | 'New'
  | 'Open'
  | 'Print'
  | 'Save'
  | 'SpellCheck';

type MultimediaNumpadKey = `Key${11 | 12}`;

type AudioKey =
  | 'AudioBalanceLeft'
  | 'AudioBalanceRight'
  | 'AudioBassBoostDown'
  | 'AudioBassBoostToggle'
  | 'AudioBassBoostUp'
  | 'AudioFaderFront'
  | 'AudioFaderRear'
  | 'AudioSurroundModeNext'
  | 'AudioTrebleDown'
  | 'AudioTrebleUp'
  | 'AudioVolumeDown'
  | 'AudioVolumeUp'
  | 'AudioVolumeMute'
  | 'MicrophoneToggle'
  | 'MicrophoneVolumeDown'
  | 'MicrophoneVolumeUp'
  | 'MicrophoneVolumeMute';

type SpeechKey = 'SpeechCorrectionList' | 'SpeechInputToggle';

type ApplicationKey =
  | `LaunchApplication${1 | 2}`
  | 'LaunchCalendar'
  | 'LaunchContacts'
  | 'LaunchMail'
  | 'LaunchMediaPlayer'
  | 'LaunchMusicPlayer'
  | 'LaunchPhone'
  | 'LaunchScreenSaver'
  | 'LaunchSpreadsheet'
  | 'LaunchWebBrowser'
  | 'LaunchWebCam'
  | 'LaunchWordProcessor';

type BrowserKey =
  | 'BrowserBack'
  | 'BrowserFavorites'
  | 'BrowserForward'
  | 'BrowserHome'
  | 'BrowserRefresh'
  | 'BrowserSearch'
  | 'BrowserStop';

type MobilePhoneKey =
  | 'AppSwitch'
  | 'Call'
  | 'Camera'
  | 'CameraFocus'
  | 'EndCall'
  | 'GoBack'
  | 'GoHome'
  | 'HeadsetHook'
  | 'LastNumberRedial'
  | 'Notification'
  | 'MannerMode'
  | 'VoiceDial';

type TVKey =
  | 'TV'
  | 'TV3DMode'
  | 'TVAntennaCable'
  | 'TVAudioDescription'
  | 'TVAudioDescriptionMixDown'
  | 'TVAudioDescriptionMixUp'
  | 'TVContentsMenu'
  | 'TVDataService'
  | 'TVInput'
  | `TVInputComponent${1 | 2}`
  | `TVInputComposite${1 | 2}`
  | `TVInputHDMI${1 | 2 | 3 | 4}`
  | 'TVInputVGA1'
  | 'TVMediaContext'
  | 'TVNetwork'
  | 'TVNumberEntry'
  | 'TVPower'
  | 'TVRadioService'
  | 'TVSatellite'
  | 'TVSatelliteBS'
  | 'TVSatelliteCS'
  | 'TVSatelliteToggle'
  | 'TVTerrestrialAnalog'
  | 'TVTerrestrialDigital'
  | 'TVTimer';

type MediaControllerKey =
  | 'AVRInput'
  | 'AVRPower'
  | 'ColorF0Red'
  | 'ColorF1Green'
  | 'ColorF2Yellow'
  | 'ColorF3Blue'
  | 'ColorF4Grey'
  | 'ColorF5Brown'
  | 'ClosedCaptionToggle'
  | 'Dimmer'
  | 'DisplaySwap'
  | 'DVR'
  | 'Exit'
  | `FavoriteClear${0 | 1 | 2 | 3}`
  | `FavoriteRecall${0 | 1 | 2 | 3}`
  | `FavoriteStore${0 | 1 | 2 | 3}`
  | 'Guide'
  | 'GuideNextDay'
  | 'GuidePreviousDay'
  | 'Info'
  | 'InstantReplay'
  | 'Link'
  | 'ListProgram'
  | 'LiveContent'
  | 'Lock'
  | 'MediaApps'
  | 'MediaAudioTrack'
  | 'MediaLast'
  | 'MediaSkipBackward'
  | 'MediaSkipForward'
  | 'MediaStepBackward'
  | 'MediaStepForward'
  | 'MediaTopMenu'
  | 'NavigateIn'
  | 'NavigateNext'
  | 'NavigateOut'
  | 'NavigatePrevious'
  | 'NextFavoriteChannel'
  | 'NextUserProfile'
  | 'OnDemand'
  | 'Pairing'
  | 'PinPDown'
  | 'PinPMove'
  | 'PinPToggle'
  | 'PinPUp'
  | 'PlaySpeedDown'
  | 'PlaySpeedReset'
  | 'PlaySpeedUp'
  | 'RandomToggle'
  | 'RcLowBattery'
  | 'RecordSpeedNext'
  | 'RfBypass'
  | 'ScanChannelsToggle'
  | 'ScreenModeNext'
  | 'Settings'
  | 'SplitScreenToggle'
  | 'STBInput'
  | 'STBPower'
  | 'Subtitle'
  | 'Teletext'
  | 'VideoModeNext'
  | 'Wink'
  | 'ZoomToggle';

export type KeyboardKey =
  | SpecialKey
  | ModifierKey
  | WhitespaceKey
  | NavigationKey
  | EditingKey
  | UIKey
  | DeviceKey
  | IMEKey
  | FunctionKey
  | MultimediaKey
  | MultimediaNumpadKey
  | AudioKey
  | SpeechKey
  | ApplicationKey
  | BrowserKey
  | MobilePhoneKey
  | TVKey
  | MediaControllerKey
  | LetterKey
  | DigitKey
  | PunctuationKey;
