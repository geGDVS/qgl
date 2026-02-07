const qglMid = [
    { "chinese": "请点击左上角查看当前单词集。", "english": "Please click on the upper left corner to view the current word set.", "type": "句子", "keyWords": [] }
];

const examSets = {
    "qgl1-8": qgl1_8,
    "qgl9-16": qgl9_16,
    "qgl17-24": qgl17_24,
    "qgl25-32": qgl25_32,
    "qgl33-40": qgl33_40,
    "qgl41-48": qgl41_48,
    "qgl49-56": qgl49_56,
    "qgl57-64": qgl57_64,
    "qgl65-72": qgl65_72,
    "qgl73-80": qgl73_80,
    "qgl81-88": qgl81_88,
    "qgl89-96": qgl89_96,
    "qgl97-104": qgl97_104,
    "qgl105-112": qgl105_112,
    "qgl137-144": qgl137_144,
    "qgl145-152": qgl145_152,
    "qgl153-160": qgl153_160,
    "qglMid": qglMid,
    "qgl161-164": qgl161_164,
    "qgl165-172": qgl165_172,
    "qgl173-180": qgl173_180,
    "qgl181-188": qgl181_188,
    "qgl189-196": qgl189_196,
    "qgl197-204": qgl197_204,
    "qgl205-212": qgl205_212,
    "qgl213-220": qgl213_220,
    "qgl221-228": qgl221_228,
    "qgl229-236": qgl229_236,
    "qgl237-244": qgl237_244,
    "qgl245-252": qgl245_252,
    "qgl253-260": qgl253_260,
    "qgl261-268": qgl261_268,
    "qgl269-276": qgl269_276,
    "qgl277-284": qgl277_284,
    "qgl285-292": qgl285_292,
    "qgl293-300": qgl293_300,
    "qgl301-308": qgl301_308,
    "qgl309-313": qgl309_313,
    "qglFinal": qglFinal
};

// 打乱所有测试集
for (const setKey in examSets) {
    examSets[setKey].sort(() => Math.random() - 0.5);
}
