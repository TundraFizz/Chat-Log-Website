from pyramid.view import view_config
from collections import deque
import datetime
import time
import json
import os
from glob import glob


@view_config(route_name="index", renderer="templates/index.jinja2")
def index(request):
    data = {"html": "", "log_history": ""}
    log_history = deque()

    if "server" in request.GET:
        server = request.GET["server"]

        if "log" in request.GET:
            this_year = request.GET["log"][0:4]
            this_week = request.GET["log"][5:7]
        else:
            this_year = str(datetime.date.today().year)
            this_week = time.strftime("%U")
    else:
        return {"html": """
        Enter a server ID number:
        <form>
        <input type="text" name="server"><input type="submit" value="Submit">
        </form>"""}

    files = [y for x in os.walk("log") for y in glob(os.path.join(x[0], "*.log"))]

    for file in files:
        temp = file[31:]
        year = temp[0:4]
        week = temp[5:7]
        name = temp[8:26]

        if name == server and "{}-{}".format(year, week) not in log_history:
            log_history.appendleft("{}-{}".format(year, week))

        if name == server and week == this_week and year == this_year:
            print("---------------------")
            channel = temp[27:-4]
            data["html"] += """
            <button type="button" onclick="ReadFile(this);"
            file="{}">{}</button>""".format(file, channel)

    data["log_history"] += """
        <form style="display: inline">
        <input type="hidden" name="server" value="{}">
        <select name="log" onchange="this.form.submit()">""".format(server)

    for lg in log_history:
        print(lg)
        # If the year and week matches, set to selected
        selected = ""
        compare = "{}-{}".format(this_year, this_week)
        if compare == lg:
            selected = "selected"

        data["log_history"] += """
        <option {} value="{}">{}</option>""".format(selected,
                                                    lg,
                                                    get_day_range(lg))

    data["log_history"] += """
    </select></form>"""

    return data


def get_day_range(lg):
    def yyyymmdd_to_english(day):
        m = datetime.datetime.strptime(day[5:7], "%m").strftime("%b")
        d = day[-2:].lstrip("0")
        y = day[0:4]
        r = "{} {}, {}".format(m, d, y)
        return r

    year = int(lg[0:4])
    week = int(lg[5:7])
    saturday = "6"

    last_day = "{}-{}-{}".format(year, week, saturday)
    last_day = datetime.datetime.strptime(last_day, "%Y-%W-%w")
    first_day = last_day - datetime.timedelta(days=6)
    sun = str(first_day)[0:10]
    sat = str(last_day)[0:10]

    sun = yyyymmdd_to_english(sun)
    sat = yyyymmdd_to_english(sat)
    range = "{} - {}".format(sun, sat)
    return range


@view_config(route_name="readfile", renderer="json")
def readfile(request):
    file = request.POST.get("file")
    data = {"text": "Error"}
    with open(file, encoding="utf8") as f:
        data["text"] = f.read()

    return data
