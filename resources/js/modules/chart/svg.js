/**
 * See LICENSE.md file for further details.
 */

import * as d3 from "./../d3";
import Configuration from "./../configuration";
import Defs from "./svg/defs";
import Zoom from "./svg/zoom";
import ExportFactory from "./svg/export-factory";
import {LAYOUT_BOTTOMTOP, LAYOUT_TOPBOTTOM} from "../constants";

/**
 * SVG class
 *
 * @author  Rico Sonntag <mail@ricosonntag.de>
 * @license https://opensource.org/licenses/GPL-3.0 GNU General Public License v3.0
 * @link    https://github.com/magicsunday/webtrees-pedigree-chart/
 */
export default class Svg
{
    /**
     * Constructor.
     *
     * @param {Selection}     parent        The selected D3 parent element container
     * @param {Configuration} configuration The application configuration
     */
    constructor(parent, configuration)
    {
        // Create the <svg> element
        this._element       = parent.append("svg");
        this._defs          = new Defs(this._element);

        this._visual        = null;
        this._zoom          = null;
        this._configuration = configuration;

        this.init();
    }

    /**
     * Initialize the <svg> element.
     *
     * @private
     */
    init()
    {
        // Add SVG element
        this._element
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("text-rendering", "geometricPrecision")
            .attr("text-anchor", "middle");

        // new Filter(this._defs.get());
    }

    /**
     * Initialiaze the <svg> element events.
     *
     * @param {Overlay} overlay
     */
    initEvents(overlay)
    {
        this._element
            .on("contextmenu", (event) => event.preventDefault())
            .on("wheel", (event) => {
                if (!event.ctrlKey) {
                    overlay.show(
                        this._configuration.labels.zoom,
                        300,
                        () => {
                            overlay.hide(700, 800);
                        }
                    );
                }
            })
            .on("touchend", (event) => {
                if (event.touches.length < 2) {
                    overlay.hide(0, 800);
                }
            })
            .on("touchmove", (event) => {
                if (event.touches.length >= 2) {
                    // Hide tooltip on more than 2 fingers
                    overlay.hide();
                } else {
                    // Show tooltip if less than 2 fingers are used
                    overlay.show(this._configuration.labels.move);
                }
            })
            .on("click", (event) => this.doStopPropagation(event), true);

        if (this._configuration.rtl) {
            this._element.classed("rtl", true);
        }

        // Add group
        this._visual = this._element.append("g");

        // this._visual
        //     .append("g")
        //     .attr("class", "personGroup");

        this._zoom = new Zoom(this._visual);
        this._element.call(this._zoom.get());

        // // For Top/Bottom and Bottom/Top layout set the initial zoom level to the number
        // // of displayed generations
        // if ((this._configuration.generations > 4)
        //     && ((this._configuration.treeLayout === LAYOUT_TOPBOTTOM)
        //     || (this._configuration.treeLayout === LAYOUT_BOTTOMTOP))
        // ) {
        //     // this._element
        //     //     .attr("transform", "translate(200, 200)")
        //     //
        //     // this._zoom.get().scaleTo(this._element, this._configuration.generations);
        // }
    }

    /**
     * Prevent default click and stop propagation.
     *
     * @param {Event} event
     *
     * @private
     */
    doStopPropagation(event)
    {
        if (event.defaultPrevented) {
            event.stopPropagation();
        }
    }

    /**
     * Exports the chart as PNG image and triggers a download.
     *
     * @param {String} type The export file type (either "png" or "svg")
     *
     * @return {PngExport|SvgExport}
     */
    export(type )
    {
        const factory = new ExportFactory();
        return factory.createExport(type);
    }

    /**
     * Returns the SVG definition instance.
     *
     * @return {Defs}
     */
    get defs()
    {
        return this._defs;
    }

    /**
     * Returns the SVG definition instance.
     *
     * @return {Zoom}
     */
    get zoom()
    {
        return this._zoom;
    }

    /**
     *
     *
     * @return {Selection}
     */
    get visual()
    {
        return this._visual;
    }

    /**
     * Returns the internal element.
     *
     * @return {Selection}
     */
    get()
    {
        return this._element;
    }
}
