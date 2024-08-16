export const parseDate = (date: string): string => {

    const split = date.split('T')
    const hour = split[1].split('.')[0]
    const newDate = `${split[0]} - ${hour}`
    return newDate;
}