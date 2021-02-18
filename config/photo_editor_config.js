import {Tool} from "react-native-photoeditorsdk";

export default {
    forceCrop: true,
    tools: [
        Tool.TRIM,
        Tool.TRANSFORM,
        Tool.FILTER,
        Tool.ADJUSTMENT,
        Tool.FOCUS,
        Tool.TEXT,
        Tool.TEXT_DESIGN,
        Tool.BRUSH
    ],
    transform: {
        items: [
            { width: 3, height: 2, toggleable: false }
        ]
    }
}
