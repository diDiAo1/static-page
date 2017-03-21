var pagingObject = function (objOption) {
    this.strPageIndex = objOption.strIndex;                 //当前页码
    this.strPageCount = objOption.strPageCount;             //总页数
    this.strDataCount = objOption.strDataCount;             //数据总数
    this.strServletLocation = objOption.strServletLocation; //Servlet分页请求路径

    //首页
    this.FirstPage = function (strParems) {
        GetChannelList(1, strParems);
    }

    //上一页
    this.PreviousPage = function (strParems) {
        if (!isNaN(parseInt(this.strPageIndex))) {
            this.strPageIndex = parseInt(this.strPageIndex);
            var pageIndex = (this.strPageIndex == 1 ? 1 : this.strPageIndex - 1);
            return GetList(pageIndex, strParems);
        } else {
            confirmShow(0, "", "参数strIndex错误。", "消息提示");
            return false;
        }
    }

    //下一页
    this.NextPage = function (strParems) {
        if (isNaN(parseInt(this.strIndex))) {
            confirmShow(0, "", "参数strIndex错误。", "消息提示");
            return false;
        }
        if (isNaN(parseInt(this.strPageCount))) {
            confirmShow(0, "", "参数strPageCount错误。", "消息提示");
            return false;
        }
        this.strPageIndex = parseInt(this.strPageIndex);
        this.strPageCount = parseInt(this.strPageCount);
        var pageIndex = (this.strIndex == this.strPageCount ? this.strIndex : this.strIndex + 1);
        return GetList(pageIndex, strParems);
    }

    //尾页
    this.EndPage = function (strParems) {
        if (isNaN(parseInt(this.strPageCount))) {
            confirmShow(0, "", "参数strPageCount错误。", "消息提示");
            return false;
        }
        this.strPageCount = parseInt(this.strPageCount);
        return GetList(this.strPageCount, strParems);
    }

    //数据查询
    this.GetList = function (strPageIndex, strParems) {
        $.ajax({
            type: "post",
            url: this.strServletLocation + "?methodName=QueryList&strPageIndex=" + strPageIndex
                + "&strPageCount=" + this.strPageCount + strParems,
            dataType: "text",
            async: false,
            success: function (r) {
                if (r == "false") {
                    return r;
                }
                else if (r == "sessionOut") {
                    doLogout();
                    return false;
                }
                else {
                    var data = $.parseJSON(r);
                    this.strPageIndex = strPageIndex;
                    this.strPageCount = parseInt((parseInt(data.total) + 9) / 10);
                    this.strDataCount = data.total;
                    return data;
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }

    //删除
    this.DelEntity = function (Id, callback, strParems) {
        $.ajax({
            type: "post",
            url: this.strServletLocation + "?methodName=del&id=" + Id,
            dataType: "text",
            async: false,
            success: function (r) {
                if (r == "true") {
                    confirmShow(0, "", "删除成功！", "消息提示");
                    if (typeof (callback) == "function")
                        callback(strParems);
                }
                else if (r == "sessionOut") {
                    doLogout();
                }
                else {
                    confirmShow(0, "", "删除失败！", "消息提示");
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }

    //实体反回
    this.GetEntity = function (Id, type) {
        $.ajax({
            type: "post",
            url: this.strServletLocation + "?methodName=" + (type == "1" ? "Init" : type) + "&id=" + Id,
            dataType: "text",
            async: false,
            success: function (r) {
                if (r == "false") {
                    confirmShow(0, "", "删除失败！", "消息提示");
                }
                else if (r == "sessionOut") {
                    doLogout();
                }
                else {
                    try {
                        return $.parseJSON(r);
                    } catch (e) {
                        confirmShow(0, "", "Json格式错误！", "消息提示");
                        return false;
                    }
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }

}