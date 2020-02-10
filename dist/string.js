"use strict";
olean;
isChinese(char, c);
{
    Character.UnicodeBlock;
    ub = Character.UnicodeBlock.of(c);
    if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
        || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
        || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
        || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
        || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
        || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {
        return true;
    }
    return false;
}
boolean;
judge(char, c);
{
    if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z')) {
        return true;
    }
    return false;
}
boolean;
isMessyCode(String, strName);
{
    //去除字符串中的空格 制表符 换行 回车
    Pattern;
    p = Pattern.compile("\\s*|\t*|\r*|\n*");
    Matcher;
    m = p.matcher(strName);
    String;
    after = m.replaceAll("");
    //去除字符串中的标点符号
    String;
    temp = after.replaceAll("\\p{P}", "");
    //处理之后转换成字符数组
    char[];
    ch = temp.trim().toCharArray();
    for (int; i = 0; i < ch.length)
        ;
    i++;
    {
        char;
        c = ch[i];
        //判断是否是数字或者英文字符
        if (!judge(c)) {
            //判断是否是中日韩文
            if (!isChinese(c)) {
                //如果不是数字或者英文字符也不是中日韩文则表示是乱码返回true
                return true;
            }
        }
    }
    //表示不是乱码 返回false
    return false;
}
