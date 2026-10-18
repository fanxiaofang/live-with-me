import fs from 'node:fs/promises';
import {test,expect} from '@playwright/test';
import {stableScene} from './helpers';

const hair=[['经典短发','shorthair'],['层叠长卷发','curly'],['偏分低束发','sidepart'],['双色蓬松碎发','shaggy']] as const;
for(const width of [1200,390]){
  test(`five-view export includes finalized NW for four hairstyles at ${width}`,async({page}, testInfo)=>{
    const evidence = testInfo.outputPath('evidence');
    test.setTimeout(60000);await page.setViewportSize({width,height:900});
    await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).copiedSvg=text;}}}));
    await stableScene(page);
    const layout=await page.evaluate(()=>localStorage.getItem('live_with_me_room_layout_v6'));
    await page.getByRole('button',{name:'人物 5 视图 SVG',exact:true}).click();
    const modal=page.getByRole('dialog',{name:'人物五视图 · 查看与导出'});
    for(const [label,id] of hair){
      await modal.getByRole('button',{name:label,exact:true}).click();
      const sheet=`character-${id}-standing-5views.svg`,nw=`character-${id}-standing-nw.svg`;
      await expect(modal.locator(`img[src="/${sheet}"]`)).toBeVisible();
      const link=modal.locator(`a[href="/${nw}"]`);
      await expect(link).toHaveCount(1);
      await modal.getByRole('button',{name:'复制代码',exact:true}).click();
      await expect.poll(()=>page.evaluate(()=>(window as any).copiedSvg)).toBe(await fs.readFile(`public/${sheet}`,'utf8'));
      const pending=page.waitForEvent('download');
      await modal.getByRole('button',{name:/下载.*05 · NW 斜侧视图 SVG/}).click();
      const download=await pending;expect(download.suggestedFilename()).toBe(nw);
      expect(await fs.readFile((await download.path())!,'utf8')).toBe(await fs.readFile(`public/${nw}`,'utf8'));
      const info=await page.evaluate(async name=>{
        const doc=new DOMParser().parseFromString(await(await fetch('/'+name)).text(),'image/svg+xml');
        const ids=[...doc.querySelectorAll('[id]')].map(n=>n.id);
        const missing=[...doc.querySelectorAll('*')].flatMap(n=>[...n.attributes].flatMap(a=>[...a.value.matchAll(/url\(#([^)]*)\)/g)].filter(m=>!ids.includes(m[1])).map(m=>m[1])));
        return{views:[...doc.querySelectorAll('[data-view]')].map(n=>n.getAttribute('data-view')),images:doc.querySelectorAll('image,foreignObject,script,parsererror').length,duplicate:ids.length-new Set(ids).size,missing};
      },sheet);
      expect(info).toEqual({views:['front','left','back','right','nw'],images:0,duplicate:0,missing:[]});
    }
    await expect.poll(()=>modal.locator('img').evaluateAll(nodes=>nodes.every(n=>(n as HTMLImageElement).complete&&(n as HTMLImageElement).naturalWidth>0))).toBe(true);
    await modal.screenshot({path:`${evidence}/export-${width}.png`});
    expect(await modal.evaluate(n=>n.scrollWidth>n.clientWidth)).toBe(false);
    await modal.getByRole('button',{name:'坐姿四视图 + NW',exact:true}).click();
    await expect(modal.locator('a[href$="standing-nw.svg"]')).toHaveCount(0);
    await expect(modal.locator('img[src="/character-shaggy-seated-5views-study.svg"]')).toBeVisible();
    await modal.getByRole('button',{name:'关闭导出窗口',exact:true}).press('Escape');
    expect(await page.evaluate(()=>localStorage.getItem('live_with_me_room_layout_v6'))).toBe(layout);
  });

  test(`full appearance has five views and NW follows draft options at ${width}`,async({page}, testInfo)=>{
    const evidence = testInfo.outputPath('evidence');
    test.setTimeout(60000);await page.setViewportSize({width,height:900});await stableScene(page);
    await page.getByText('更换状态与装扮',{exact:true}).click();
    const modal=page.locator('#status-picker-modal');
    await modal.getByRole('button',{name:'人物装扮',exact:true}).click();
    await modal.getByRole('button',{name:'查看完整装扮',exact:true}).click();
    const views=modal.getByRole('region',{name:'完整装扮五视图'});
    await expect(views.getByTestId('appearance-five-view')).toHaveCount(5);
    for(const [label,id] of hair){
      await modal.getByRole('button',{name:new RegExp(label==='经典短发'?'经典利落短发':label)}).click();
      await expect(views.locator('[data-finalized-nw]')).toHaveAttribute('data-finalized-nw',id);
      await expect(views.locator('[data-facing="NW"]')).toHaveCount(1);
      await expect(views.locator('[data-facing="NW-eight-view"]')).toHaveCount(1);
    }
    await modal.getByRole('button',{name:'健康暖棕',exact:true}).click();
    await modal.getByRole('button',{name:'复古赤陶',exact:true}).click();
    await modal.getByRole('button',{name:'暖柿红',exact:true}).click();
    await modal.getByRole('button',{name:'银灰',exact:true}).click();
    await modal.getByRole('button',{name:'帽顶毛球：有',exact:true}).click();
    const nw=views.locator('[data-finalized-nw]');
    await expect(nw).toHaveAttribute('data-nw-pompom','false');
    expect(await nw.evaluate(n=>{const s=getComputedStyle(n);return['--nw-skin','--nw-hat','--nw-hair','--nw-shirt'].map(p=>s.getPropertyValue(p));})).toEqual(['#d4a373','#9c5339','#b8afa0','#e07a5f']);
    const ids=await views.evaluate(n=>{const ids=[...n.querySelectorAll('[id]')].map(n=>n.id);return ids.length-new Set(ids).size;});expect(ids).toBe(0);
    await modal.getByRole('button',{name:'收起完整装扮',exact:true}).click();
    await modal.getByRole('button',{name:'查看完整装扮',exact:true}).click();
    await views.screenshot({path:`${evidence}/appearance-${width}.png`});
    await nw.scrollIntoViewIfNeeded();
    await nw.locator('..').screenshot({path:`${evidence}/appearance-nw-${width}.png`});
    expect(await modal.evaluate(n=>n.scrollWidth>n.clientWidth)).toBe(false);
    await modal.locator('#confirm-status-btn').click();
    await page.getByText('更换状态与装扮',{exact:true}).click();
    await modal.getByRole('button',{name:'人物装扮',exact:true}).click();
    await modal.getByRole('button',{name:'查看完整装扮',exact:true}).click();
    await expect(views.locator('[data-finalized-nw]')).toHaveAttribute('data-finalized-nw','shaggy');
    await expect(views.locator('[data-nw-pompom]')).toHaveAttribute('data-nw-pompom','false');
  });
}
