// Weekly chart
export const checkDate = (dateToCheck: Date, daysAgo: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() - daysAgo)

    return (
        dateToCheck.getDate() === targetDate.getDate() &&
        dateToCheck.getMonth() === targetDate.getMonth() &&
        dateToCheck.getFullYear() === targetDate.getFullYear()
    )
}

export const weeklyChart = (chartItems: {date: Date, view: number}[]) => {
    return [
        {
            date: "6 days ago",
            views: chartItems.filter(item => checkDate(item.date, 6))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "5 days ago",
            views: chartItems.filter(item => checkDate(item.date, 5))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "4 days ago",
            views: chartItems.filter(item => checkDate(item.date, 4))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "3 days ago",
            views: chartItems.filter(item => checkDate(item.date, 3))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "2 days ago",
            views: chartItems.filter(item => checkDate(item.date, 2))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "1 day ago",
            views: chartItems.filter(item => checkDate(item.date, 1))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "today",
            views: chartItems.filter(item => checkDate(item.date, 0))
                    .reduce((acc, i) => acc + i.view, 0)
        }

    ]
}

export const weeklyChartBookmark = (chartItems: {date: Date, bookmark: number}[]) => {
    return [
        {
            date: "6 days ago",
            bookmarks: chartItems.filter(item => checkDate(item.date, 6))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "5 days ago",
            bookmarks: chartItems.filter(item => checkDate(item.date, 5))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "4 days ago",
            bookmarks: chartItems.filter(item => checkDate(item.date, 4))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "3 days ago",
            bookmarks: chartItems.filter(item => checkDate(item.date, 3))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "2 days ago",
            bookmarks: chartItems.filter(item => checkDate(item.date, 2))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "1 day ago",
            bookmarks: chartItems.filter(item => checkDate(item.date, 1))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "today",
            bookmarks: chartItems.filter(item => checkDate(item.date, 0))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        }

    ]
}

// Monthly Chart
export const betweenWeeks = (dateToCheck: Date, betweenDate1: number, betweenDate2:number) => {
  const today = new Date()

  const targetDate1 = new Date(today)
  const targetDate2 = new Date(today)

  targetDate1.setDate(targetDate1.getDate() - betweenDate1)
  targetDate2.setDate(targetDate2.getDate() - betweenDate2)

  return dateToCheck <= targetDate1 && dateToCheck >= targetDate2
}

export const monthlychart = (chartItems: {date: Date, view: number}[]) => {
    return [
        {
            date: "3 weeks ago",
            views: chartItems.filter(item => betweenWeeks(item.date, 21, 28))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "2 weeks ago",
            views: chartItems.filter(item => betweenWeeks(item.date, 14, 21))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "1 week ago",
            views: chartItems.filter(item => betweenWeeks(item.date, 7, 14))
                    .reduce((acc, i) => acc + i.view, 0)
        },
        {
            date: "this week",
            views: chartItems.filter(item => betweenWeeks(item.date, 0, 7))
                    .reduce((acc, i) => acc + i.view, 0)
        }
    ]
}

export const monthlychartbookmark = (chartItems: {date: Date, bookmark: number}[]) => {
    return [
        {
            date: "3 weeks ago",
            bookmarks: chartItems.filter(item => betweenWeeks(item.date, 21, 28))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "2 weeks ago",
            bookmarks: chartItems.filter(item => betweenWeeks(item.date, 14, 21))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "1 week ago",
            bookmarks: chartItems.filter(item => betweenWeeks(item.date, 7, 14))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        },
        {
            date: "this week",
            bookmarks: chartItems.filter(item => betweenWeeks(item.date, 0, 7))
                    .reduce((acc, i) => acc + i.bookmark, 0)
        }
    ]
}